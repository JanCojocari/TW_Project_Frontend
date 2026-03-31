namespace Rentora.Domain.Models.SupportRequest;

using Rentora.Domain.Enums;

public class SupportRequestDto
{
    public int Id { get; set; }
    public int? UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public SupportStatus Status { get; set; }
}