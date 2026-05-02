using Microsoft.Extensions.Configuration;
using Rentora.BusinessLayer.Core;
using Rentora.BusinessLayer.Interfaces;

namespace Rentora.BusinessLayer.Structure;

public class PayPalLogicExecution : PayPalLogicActions, IPayPalLogic
{
    public PayPalLogicExecution(IHttpClientFactory httpClientFactory, IConfiguration config)
        : base(httpClientFactory, config) { }

    public async Task<string> CreateOrderAsync(decimal amount, string currency)
        => await CreateOrderCoreAsync(amount, currency);

    public async Task<string> CaptureOrderAsync(
        string paypalOrderId, int apartmentId, int renterId,
        decimal amount, string currency,
        DateTime? startDate, DateTime? endDate)
        => await CaptureOrderCoreAsync(
            paypalOrderId, apartmentId, renterId,
            amount, currency, startDate, endDate);
}