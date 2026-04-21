namespace Rentora.Domain.Models.Apartment;

public class ApartmentQueryParams
{
    public int    Page     { get; set; } = 1;
    public int    PageSize { get; set; } = 24;

    public string? Search       { get; set; }
    public string? City         { get; set; }
    public string? Availability { get; set; } // "available" | "occupied" | "ALL"
    public string? Currency     { get; set; } // "USD" | "EUR" | "MDL" | "ALL"
    public string? Interval     { get; set; } // "hour" | "day" | "month" | "ALL"
    public decimal? MinPrice    { get; set; }
    public decimal? MaxPrice    { get; set; }
    public double?  MinRating   { get; set; }
    public int?     MinReviews  { get; set; }

    // Facilities
    public bool? Wifi           { get; set; }
    public bool? Parking        { get; set; }
    public bool? AirConditioning { get; set; }
    public bool? Heating        { get; set; }
    public bool? Washer         { get; set; }
    public bool? Dryer          { get; set; }
    public bool? Kitchen        { get; set; }
    public bool? TV             { get; set; }
    public bool? Pool           { get; set; }
    public bool? Gym            { get; set; }
    public bool? Elevator       { get; set; }
    public bool? PetsAllowed    { get; set; }
    public bool? Balcony        { get; set; }
}
