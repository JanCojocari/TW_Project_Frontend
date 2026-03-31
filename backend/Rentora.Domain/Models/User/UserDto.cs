namespace Rentora.Domain.Models.User;

using Rentora.Domain.Enums;

public class UserDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public DateTime Birthday { get; set; }
    public string? Gender { get; set; }
    public decimal AccountBalance { get; set; }
    public Role Role { get; set; }
}