namespace Rentora.Domain.Entities;

public class Facilities
{
    public int Id { get; set; }
    public int ApartmentId { get; set; }

    // Internet & Parcare
    public bool Wifi { get; set; }
    public bool Parking { get; set; }
    public bool ParkingFree { get; set; }

    // Clima
    public bool AirConditioning { get; set; }
    public bool Heating { get; set; }

    // Electrocasnice
    public bool Washer { get; set; }
    public bool Dryer { get; set; }
    public bool Dishwasher { get; set; }
    public bool Refrigerator { get; set; }
    public bool Microwave { get; set; }
    public bool Oven { get; set; }
    public bool Stove { get; set; }
    public bool Kitchen { get; set; }
    public bool TV { get; set; }

    // Spatii & Dotari
    public bool Balcony { get; set; }
    public bool Terrace { get; set; }
    public bool Garden { get; set; }
    public bool Pool { get; set; }
    public bool Gym { get; set; }
    public bool Elevator { get; set; }

    // Politici
    public bool PetsAllowed { get; set; }
    public bool SmokingAllowed { get; set; }

    // Securitate
    public bool SecurityCamera { get; set; }
    public bool KeypadEntry { get; set; }
    public bool Safe { get; set; }

    public Apartment Apartment { get; set; } = null!;
}