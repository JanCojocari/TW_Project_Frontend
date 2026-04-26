namespace Rentora.Domain.Models.User;

public class UserRegisterDto
{
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public DateTime Birthday { get; set; }
    public string? Gender { get; set; }
    public string? Role { get; set; }
}