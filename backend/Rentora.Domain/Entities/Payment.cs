using System.ComponentModel.DataAnnotations;
using Rentora.Domain.Enums;

namespace Rentora.Domain.Entities;

public class Payment
{
    [Key]
    public int Id { get; set; }

    public int? OwnerId { get; set; }

    public int? RenterId { get; set; }

    public int? ApartmentId { get; set; }

    public decimal TotalCost { get; set; }

    public Currency Currency { get; set; } //moneda platii stocata ca enum

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public string? InvoiceUrl { get; set; } //optional pt ca nota se genereaza dupa plata
    
    public string? TransactionId { get; set; }   // ID-ul returnat de PayPal
    public string? PaymentMethod { get; set; }   // "card" | "paypal" | "bank_transfer"

    // Navigation
    public User? Owner { get; set; } = null!;
    public User? Renter { get; set; } = null!;
    public Apartment? Apartment { get; set; } = null!;
}