namespace Rentora.Domain.Models.SupportRequest;

public class SupportRequestCreateDto
{
    public string Email { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}