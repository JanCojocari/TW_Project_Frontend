using Microsoft.Extensions.Configuration;
using Rentora.BusinessLayer.Core;
using Rentora.BusinessLayer.Interfaces;

namespace Rentora.BusinessLayer.Structure;

public class StripeLogicExecution : StripeActions, IStripeLogic
{
    public StripeLogicExecution(IHttpClientFactory httpClientFactory, IConfiguration config)
        : base(httpClientFactory, config) { }

    public async Task<string> CreatePaymentIntentAsync(decimal amount, string currency)
        => await CreatePaymentIntentCoreAsync(amount, currency);

    public async Task<string> ConfirmPaymentAsync(
        string paymentIntentId, int apartmentId, int renterId,
        decimal amount, string currency,
        DateTime? startDate, DateTime? endDate)
        => await ConfirmPaymentCoreAsync(
            paymentIntentId, apartmentId, renterId,
            amount, currency, startDate, endDate);
}