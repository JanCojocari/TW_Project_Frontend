namespace Rentora.Domain.Models.Review;

using System.ComponentModel.DataAnnotations;

public class ReviewCreateDto
{
    [Range(1, int.MaxValue)]
    public int ApartmentId { get; set; }

    [MaxLength(2000)]
    public string? Comment { get; set; }

    [Range(1, 5)]
    public int Rating { get; set; }
}
