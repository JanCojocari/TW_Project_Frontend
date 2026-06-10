namespace Rentora.Domain.Models.Apartment;

using System.ComponentModel.DataAnnotations;
using Rentora.Domain.Enums;
using Rentora.Domain.OwnedTypes;
using Rentora.Domain.Models.Facilities;

public class ApartmentCreateDto
{
    [Required]
    [MinLength(5)]
    [MaxLength(300)]
    public string Address { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string? ImageUrl { get; set; }

    public RentInterval Interval { get; set; }

    [Range(0.01, 1_000_000)]
    public decimal CostPerInterval { get; set; }

    public Currency Currency { get; set; } = Currency.EUR;
    public RentMode RentMode { get; set; }
    public MapLocation Location { get; set; } = new MapLocation();
    public AdditionalInfo AdditionalInfo { get; set; } = new AdditionalInfo();
    public FacilitiesDto? Facilities { get; set; }
}
