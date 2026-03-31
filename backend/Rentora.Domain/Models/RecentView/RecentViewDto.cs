namespace Rentora.Domain.Models.RecentView;

public class RecentViewDto
{
    public int UserId { get; set; }
    public int ApartmentId { get; set; }
    public DateTime ViewedAt { get; set; }
}