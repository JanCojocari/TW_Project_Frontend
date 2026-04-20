// Rentora.Domain/Models/User/UserUpdateDto.cs
namespace Rentora.Domain.Models.User;

public class UserUpdateDto
{
    public string?   Name     { get; set; }
    public string?   Surname  { get; set; }
    public string?   Phone    { get; set; }
    public string?   Email    { get; set; }
    public DateTime? Birthday { get; set; }
    public string?   Gender   { get; set; }
}