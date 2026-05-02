using System.Text;
using System.Text.Json;
using System.Net.Http.Headers;
using Microsoft.Extensions.Configuration;
using Rentora.DataAccess;
using Rentora.Domain.Entities;

namespace Rentora.BusinessLayer.Core;

public class StripeActions
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly string _secretKey;
    private const string BaseUrl = "https://api.stripe.com/v1";

    public StripeActions(IHttpClientFactory httpClientFactory, IConfiguration config)
    {
        _httpClientFactory = httpClientFactory;
        _secretKey = config["Stripe:SecretKey"]!;
    }

    protected async Task<string> CreatePaymentIntentCoreAsync(decimal amount, string currency)
    {
        var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Basic",
                Convert.ToBase64String(Encoding.UTF8.GetBytes($"{_secretKey}:")));

        // Stripe lucreaza cu suma in sub-unitati (cents/bani)
        var amountInCents = (long)(amount * 100);

        var formContent = new FormUrlEncodedContent([
            new KeyValuePair<string, string>("amount", amountInCents.ToString()),
            new KeyValuePair<string, string>("currency", currency.ToLower()),
            new KeyValuePair<string, string>("payment_method_types[]", "card"),
        ]);

        var response = await client.PostAsync($"{BaseUrl}/payment_intents", formContent);
        var json = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
            throw new Exception($"Stripe error: {json}");

        var doc = JsonDocument.Parse(json);
        // returneaza client_secret necesar pe frontend pentru confirmarea platii
        return doc.RootElement.GetProperty("client_secret").GetString()!;
    }

    protected async Task<string> ConfirmPaymentCoreAsync(
        string paymentIntentId, int apartmentId, int renterId,
        decimal amount, string currency,
        DateTime? startDate, DateTime? endDate)
    {
        // Verifica statusul PaymentIntent la Stripe
        var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Basic",
                Convert.ToBase64String(Encoding.UTF8.GetBytes($"{_secretKey}:")));

        var response = await client.GetAsync($"{BaseUrl}/payment_intents/{paymentIntentId}");
        var json = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
            throw new Exception($"Stripe error: {json}");

        var doc = JsonDocument.Parse(json);
        var status = doc.RootElement.GetProperty("status").GetString()!;

        if (status != "succeeded")
            throw new Exception($"PaymentIntent status neasteptat: {status}");

        // Salveaza plata in baza de date
        using var db = new AppDbContext();

        var apartment = db.Apartments.Find(apartmentId)
            ?? throw new Exception("Apartamentul nu a fost gasit.");

        var payment = new Payment
        {
            ApartmentId   = apartmentId,
            RenterId      = renterId,
            OwnerId       = apartment.OwnedId,
            TotalCost     = amount,
            Currency      = Enum.Parse<Rentora.Domain.Enums.Currency>(currency, ignoreCase: true),
            TransactionId = paymentIntentId,
            PaymentMethod = "stripe",
            StartDate     = startDate,
            EndDate       = endDate,
            CreatedAt     = DateTime.UtcNow,
        };

        if (startDate.HasValue && endDate.HasValue)
            apartment.RenterId = renterId;

        db.Payments.Add(payment);
        await db.SaveChangesAsync();

        return paymentIntentId;
    }
}