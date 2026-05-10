namespace Rentora.Domain.Models.Admin;

public class AdminStatsDto
{
    public int TotalUsers { get; set; }
    public int TotalApartments { get; set; }
    public int PendingApartments { get; set; }
    public int ApprovedApartments { get; set; }
    public int DeclinedApartments { get; set; }
    public int TotalPayments { get; set; }
    public int TotalReviews { get; set; }
    public int TotalSupportRequests { get; set; }
    public int OpenSupportRequests { get; set; }
}