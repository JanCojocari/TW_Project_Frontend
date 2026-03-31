namespace Rentora.Domain.Models.User;

public class UserUpdateDto
{
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public DateTime Birthday { get; set; }
    public string? Gender { get; set; }
}