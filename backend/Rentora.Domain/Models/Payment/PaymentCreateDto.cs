namespace Rentora.Domain.Models.Payment;

using System.ComponentModel.DataAnnotations;
using Rentora.Domain.Enums;

public class PaymentCreateDto
{
    [Range(1, int.MaxValue)]
    public int ApartmentId { get; set; }

    public Currency Currency { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}
