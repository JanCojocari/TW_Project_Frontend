namespace Rentora.API.Controllers;

using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Rentora.BusinessLayer;
using Rentora.BusinessLayer.Structure;
using Rentora.Domain.Models.User;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly Rentora.BusinessLayer.Interfaces.IUserAction _userAction;

    public AuthController(IConfiguration config)
    {
        _userAction = new UserActionExecution(config);
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] UserRegisterDto data)
    {
        var result = _userAction.Register(data);
        if (!result.IsSuccess)
            return BadRequest(result.Message);
        return Ok(result.Message);
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] UserLoginDto data)
    {
        var result = _userAction.Login(data);
        if (result is Rentora.Domain.Models.Responses.ActionResponse res && !res.IsSuccess)
            return Unauthorized(new { message = res.Message });
        return Ok(result);
    }
}