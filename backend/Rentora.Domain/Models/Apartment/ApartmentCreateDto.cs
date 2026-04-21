namespace Rentora.Domain.Models.Apartment;

using Rentora.Domain.Enums;
using Rentora.Domain.OwnedTypes;
using Rentora.Domain.Models.Facilities;

public class ApartmentCreateDto
{
    public string Address { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public RentInterval Interval { get; set; }
    public decimal CostPerInterval { get; set; }
    public Currency Currency { get; set; } = Currency.EUR;
    public RentMode RentMode { get; set; }
    public MapLocation Location { get; set; } = new MapLocation();
    public AdditionalInfo AdditionalInfo { get; set; } = new AdditionalInfo();
    public FacilitiesDto? Facilities { get; set; }
}