namespace Rentora.Domain.Models.Payment;

using Rentora.Domain.Enums;

public class PaymentCreateDto
{
    public int ApartmentId { get; set; }
    public Currency Currency { get; set; }
}