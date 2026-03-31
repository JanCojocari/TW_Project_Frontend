namespace Rentora.Domain.Models.Review;

public class ReviewDto
{
    public int Id { get; set; }
    public int ApartmentId { get; set; }
    public int UserId { get; set; }
    public string? Comment { get; set; }
    public string? OwnerResponse { get; set; }
    public int Rating { get; set; }
    public DateTime CreatedAt { get; set; }
}