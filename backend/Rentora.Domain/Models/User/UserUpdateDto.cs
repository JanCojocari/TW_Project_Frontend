// Rentora.Domain/Models/User/UserUpdateDto.cs
namespace Rentora.Domain.Models.User;

using System.ComponentModel.DataAnnotations;

public class UserUpdateDto
{
    [MaxLength(100)]
    public string?   Name     { get; set; }

    [MaxLength(100)]
    public string?   Surname  { get; set; }

    [MaxLength(20)]
    public string?   Phone    { get; set; }

    [EmailAddress]
    [MaxLength(200)]
    public string?   Email    { get; set; }

    public DateTime? Birthday { get; set; }

    [MaxLength(50)]
    public string?   Gender   { get; set; }
}
