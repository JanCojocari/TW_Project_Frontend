namespace Rentora.Domain.Entities;

public class Favorite
{
    //nu avem key deoarece folosim cheie compura userId + apartmentId
    public int UserId { get; set; }
    public int ApartmentId { get; set; }

    // Navigation
    public User User { get; set; } = null!;
    public Apartment Apartment { get; set; } = null!;
}