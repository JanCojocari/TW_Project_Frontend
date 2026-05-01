// Rentora.Domain/Models/Payment/PaymentDto.cs
namespace Rentora.Domain.Models.Payment;

public class PaymentDto
{
    public int       Id          { get; set; }
    public int       OwnerId     { get; set; }
    public int       RenterId    { get; set; }
    public int       ApartmentId { get; set; }
    public DateTime? StartDate   { get; set; }
    public DateTime? EndDate     { get; set; }
    public decimal   TotalCost   { get; set; }
    public string    Currency    { get; set; } = "";
    public DateTime  CreatedAt   { get; set; }
    public string?   InvoiceUrl  { get; set; }
    public string ApartmentAddress { get; set; } = "";
    public string RenterName       { get; set; } = "";
    public string RenterSurname    { get; set; } = "";
    public string RenterEmail      { get; set; } = "";
    public string OwnerName        { get; set; } = "";
}