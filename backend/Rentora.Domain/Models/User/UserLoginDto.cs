namespace Rentora.Domain.Models.User;

using System.ComponentModel.DataAnnotations;

public class UserLoginDto
{
    [Required]
    [EmailAddress]
    [MaxLength(200)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Password { get; set; } = string.Empty;
}
