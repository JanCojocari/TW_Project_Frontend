namespace Rentora.Domain.Models.Apartment;

using Rentora.Domain.Enums;
using Rentora.Domain.OwnedTypes;

public class ApartmentDto
{
    public int Id { get; set; }
    public int OwnedId { get; set; }
    public int? RenterId { get; set; }
    public string Address { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public RentInterval Interval { get; set; }
    public decimal CostPerInterval { get; set; }
    public RentMode RentMode { get; set; }
    public MapLocation Location { get; set; } = new MapLocation();
    public AdditionalInfo AdditionalInfo { get; set; } = new AdditionalInfo();
}