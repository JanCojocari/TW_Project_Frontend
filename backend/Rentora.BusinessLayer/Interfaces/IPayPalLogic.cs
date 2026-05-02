namespace Rentora.BusinessLayer.Interfaces;

public interface IPayPalLogic
{
    Task<string> CreateOrderAsync(decimal amount, string currency);
    Task<string> CaptureOrderAsync(
        string paypalOrderId, int apartmentId, int renterId,
        decimal amount, string currency,
        DateTime? startDate, DateTime? endDate);
}