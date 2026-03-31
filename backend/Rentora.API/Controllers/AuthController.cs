namespace Rentora.API.Controllers;

using Microsoft.AspNetCore.Mvc;
using Rentora.BusinessLayer;
using Rentora.Domain.Models.User;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly Rentora.BusinessLayer.Interfaces.IUserAction _userAction;

    public AuthController()
    {
        var bl = new BusinessLogic();
        _userAction = bl.UserAction();
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
            return Unauthorized(res.Message);
        return Ok(result);
    }
}