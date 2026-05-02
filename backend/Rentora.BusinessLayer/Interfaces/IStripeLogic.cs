namespace Rentora.BusinessLayer.Interfaces;

public interface IStripeLogic
{
    Task<string> CreatePaymentIntentAsync(decimal amount, string currency);
    Task<string> ConfirmPaymentAsync(
        string paymentIntentId, int apartmentId, int renterId,
        decimal amount, string currency,
        DateTime? startDate, DateTime? endDate);
}