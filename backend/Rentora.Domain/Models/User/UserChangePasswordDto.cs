// Rentora.Domain/Models/User/UserChangePasswordDto.cs
namespace Rentora.Domain.Models.User;

public class UserChangePasswordDto
{
    public string OldPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}