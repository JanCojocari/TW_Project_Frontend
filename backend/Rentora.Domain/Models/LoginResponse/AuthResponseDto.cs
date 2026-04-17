using Rentora.Domain.Models.User;

namespace Rentora.Domain.Models.LoginResponse;

public class AuthResponseDto
{
    public UserDto User { get; set; }
    public string AccessToken { get; set; }
}