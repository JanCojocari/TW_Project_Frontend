// Rentora.Domain/Models/User/UserChangePasswordDto.cs
namespace Rentora.Domain.Models.User;

using System.ComponentModel.DataAnnotations;

public class UserChangePasswordDto
{
    [Required]
    [MaxLength(100)]
    public string OldPassword { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    [MaxLength(100)]
    public string NewPassword { get; set; } = string.Empty;
}
