namespace Rentora.Domain.OwnedTypes;

//facilitati stocate ca JSON intr-o singura coloane a db
public class Facilities
{
    public bool Wifi { get; set; }
    public bool Parking { get; set; }
    public bool AirConditioning { get; set; }
    public bool Heating { get; set; }
    public bool Washer { get; set; }
    public bool Dryer { get; set; }
    public bool Kitchen { get; set; }
    public bool TV { get; set; }
    public bool Elevator { get; set; }
    public bool Gym { get; set; }
    public bool Pool { get; set; }
    public bool PetsAllowed { get; set; }
    public bool SmokingAllowed { get; set; } 
}