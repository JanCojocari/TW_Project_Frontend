using System.ComponentModel.DataAnnotations;

namespace Rentora.Domain.Entities;

public class RecentView
{
    [Key]
    public int Id { get; set; }

    public int UserId { get; set; }

    public int ApartmentId { get; set; }

    public DateTime ViewedAt { get; set; } = DateTime.UtcNow;

    // Navigation 
    public User User { get; set; } = null!;
    public Apartment Apartment { get; set; } = null!;
}