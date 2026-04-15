using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Rentora.DataAccess;
using Rentora.Domain.Entities;

namespace Rentora.BusinessLayer.Core;

public class PayPalLogicActions
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly string _clientId;
    private readonly string _clientSecret;
    private const string BaseUrl = "https://api-m.sandbox.paypal.com";

    protected readonly AppDbContext db = new AppDbContext();

    public PayPalLogicActions(IHttpClientFactory httpClientFactory, IConfiguration config)
    {
        _httpClientFactory = httpClientFactory;
        _clientId     = config["PayPal:ClientId"]!;
        _clientSecret = config["PayPal:ClientSecret"]!;
    }

    protected async Task<string> GetAccessTokenAsync()
    {
        var client = _httpClientFactory.CreateClient();
        var credentials = Convert.ToBase64String(
            Encoding.UTF8.GetBytes($"{_clientId}:{_clientSecret}"));
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Basic", credentials);
        var content = new FormUrlEncodedContent([
            new KeyValuePair<string, string>("grant_type", "client_credentials")
        ]);
        var response = await client.PostAsync($"{BaseUrl}/v1/oauth2/token", content);
        response.EnsureSuccessStatusCode();
        var json = await response.Content.ReadAsStringAsync();
        var doc  = JsonDocument.Parse(json);
        return doc.RootElement.GetProperty("access_token").GetString()!;
    }

    protected async Task<string> CreateOrderCoreAsync(decimal amount, string currency)
    {
        var token  = await GetAccessTokenAsync();
        var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);
        var body = new
        {
            intent = "CAPTURE",
            purchase_units = new[]
            {
                new { amount = new { currency_code = currency, value = amount.ToString("F2") } }
            }
        };
        var response = await client.PostAsync(
            $"{BaseUrl}/v2/checkout/orders",
            new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json"));
        response.EnsureSuccessStatusCode();
        var json = await response.Content.ReadAsStringAsync();
        var doc  = JsonDocument.Parse(json);
        return doc.RootElement.GetProperty("id").GetString()!;
    }

    protected async Task<string> CaptureOrderCoreAsync(
        string paypalOrderId, int apartmentId, int renterId, decimal amount, string currency)
    {
        // 1. captura la PayPal
        var token  = await GetAccessTokenAsync();
        var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);
        var response = await client.PostAsync(
            $"{BaseUrl}/v2/checkout/orders/{paypalOrderId}/capture",
            new StringContent("{}", Encoding.UTF8, "application/json"));
        response.EnsureSuccessStatusCode();
        var json   = await response.Content.ReadAsStringAsync();
        var doc    = JsonDocument.Parse(json);
        var status = doc.RootElement.GetProperty("status").GetString()!;

        if (status != "COMPLETED")
            throw new Exception($"PayPal capture status neasteptat: {status}");

        // 2. ia ownerId din apartament
        var apartment = db.Apartments.Find(apartmentId)
            ?? throw new Exception("Apartamentul nu a fost gasit.");

        // 3. salveaza in Payments
        var payment = new Payment
        {
            ApartmentId   = apartmentId,
            RenterId      = renterId,
            OwnerId       = apartment.OwnedId,
            TotalCost     = amount,
            Currency      = Enum.Parse<Rentora.Domain.Enums.Currency>(currency, ignoreCase: true),
            TransactionId = paypalOrderId,
            PaymentMethod = "paypal",
            CreatedAt     = DateTime.UtcNow
        };
        db.Payments.Add(payment);
        await db.SaveChangesAsync();

        return paypalOrderId;
    }
}