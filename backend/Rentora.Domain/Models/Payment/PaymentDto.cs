namespace Rentora.Domain.Models.Payment;

using Rentora.Domain.Enums;

public class PaymentDto
{
    public int Id { get; set; }
    public int OwnerId { get; set; }
    public int RenterId { get; set; }
    public int ApartmentId { get; set; }
    public decimal TotalCost { get; set; }
    public Currency Currency { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? InvoiceUrl { get; set; }
}