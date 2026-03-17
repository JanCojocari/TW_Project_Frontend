namespace Rentora.Domain.OwnedTypes;

//locatia apartamentului stocat ca JSON pe o singura coloana a db
public class MapLocation
{
    public double Lat { get; set; }
    public double Lng { get; set; }
    public string City { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string FullAddress { get; set; } = string.Empty;
}