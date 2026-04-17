using System.ComponentModel.DataAnnotations;

namespace Rentora.Domain.Entities;

public class Review
{
    [Key]
    public int Id { get; set; }

    public int ApartmentId { get; set; }

    public int? UserId { get; set; }

    public string? Comment { get; set; }

    public string? OwnerResponse { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int Rating { get; set; }

    // Navigation
    public Apartment Apartment { get; set; } = null!;
    public User? User { get; set; } = null!;
}