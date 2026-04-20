namespace Rentora.Domain.Entities;
using System.ComponentModel.DataAnnotations;
using Rentora.Domain.Enums;

public class User
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(30, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(30, MinimumLength = 2)]
    public string Surname { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Phone]
    public string Phone { get; set; } = string.Empty;

    public DateTime Birthday { get; set; }

    public string? Gender { get; set; }

    public decimal AccountBalance { get; set; }

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    public Role Role { get; set; } = Role.Renter;

    public string? AvatarUrl { get; set; }

    public ICollection<Apartment> OwnedApartments { get; set; } = new List<Apartment>();
    public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
    public ICollection<RecentView> RecentViews { get; set; } = new List<RecentView>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}