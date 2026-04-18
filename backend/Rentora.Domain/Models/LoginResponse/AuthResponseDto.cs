using Rentora.Domain.Models.User;

namespace Rentora.Domain.Models.LoginResponse;

public class AuthResponseDto
{
    public required UserDto User { get; set; }
    public required string AccessToken { get; set; }
}