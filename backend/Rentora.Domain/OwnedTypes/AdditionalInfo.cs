namespace Rentora.Domain.OwnedTypes;
using Rentora.Domain.Enums;

public class AdditionalInfo
{
    public int Rooms { get; set; }
    public int Bedrooms { get; set; }
    public int Bathrooms { get; set; }
    public int Beds { get; set; }
    public int Floor { get; set; }
    public int TotalFloors { get; set; }
    public double Area { get; set; }
    public int MaxGuests { get; set; }
    public string Description { get; set; } = string.Empty;
    public string HouseRules { get; set; } = string.Empty;
    public CancellationPolicy CancellationPolicy { get; set; }
}