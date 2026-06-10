namespace Rentora.Domain.Models.User;

using System.ComponentModel.DataAnnotations;

public class UserUpdateAvatarDto
{
    [MaxLength(2000)]
    public string AvatarUrl { get; set; } = string.Empty;
}