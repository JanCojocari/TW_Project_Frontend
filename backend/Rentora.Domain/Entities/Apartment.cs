namespace Rentora.Domain.Entities;

using System.ComponentModel.DataAnnotations;
using Rentora.Domain.Enums;
using Rentora.Domain.OwnedTypes;

public class Apartment
{
    [Key]
    public int Id { get; set; }
    
    public int OwnedId { get; set; }
    
    public int? RenterId { get; set; }

    [Required]
    public string Address { get; set; } = string.Empty;
    
    public string? ImageUrl { get; set; }
    
    public RentInterval Interval { get; set; }
    
    public decimal CostPerInterval { get; set; }
    
    public RentMode RentMode { get; set; }

    public MapLocation Location { get; set; } = new MapLocation();
    public Facilities Facilities { get; set; } = new Facilities();
    public AdditionalInfo AdditionlaInfo { get; set; } = new AdditionalInfo();

    public User Owner { get; set; } = null;
    public User? Renter { get; set; } = null;
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
}