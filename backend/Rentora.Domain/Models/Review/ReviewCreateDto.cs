namespace Rentora.Domain.Models.Review;

public class ReviewCreateDto
{
    public int ApartmentId { get; set; }
    public string? Comment { get; set; }
    public int Rating { get; set; }
}