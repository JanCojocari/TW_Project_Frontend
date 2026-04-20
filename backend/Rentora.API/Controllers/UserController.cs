// Rentora.API/Controllers/UserController.cs
namespace Rentora.API.Controllers;

using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Rentora.BusinessLayer.Structure;
using Rentora.Domain.Models.User;

[Route("api/users")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly Rentora.BusinessLayer.Interfaces.IUserAction _userAction;

    public UserController(IConfiguration config)
    {
        _userAction = new UserActionExecution(config);
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] UserLoginDto data)
    {
        var result = _userAction.Login(data);
        if (result is Rentora.Domain.Models.Responses.ActionResponse resp && !resp.IsSuccess)
            return Unauthorized(resp.Message);
        return Ok(result);
    }

    [Authorize]
    [HttpGet]
    public IActionResult GetAll()
    {
        var users = _userAction.GetAll();
        return Ok(users);
    }

    [Authorize]
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var user = _userAction.GetById(id);
        if (user == null)
            return NotFound($"User with id {id} not found.");
        return Ok(user);
    }

    [Authorize]
    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] UserUpdateDto data)
    {
        var result = _userAction.Update(id, data);
        if (!result.IsSuccess)
            return BadRequest(result.Message);
        return Ok(result.Message);
    }

    [Authorize]
    [HttpPut("{id}/password")]
    public IActionResult ChangePassword(int id, [FromBody] UserChangePasswordDto data)
    {
        var result = _userAction.ChangePassword(id, data);
        if (!result.IsSuccess)
            return BadRequest(result.Message);
        return Ok(result.Message);
    }

    [Authorize]
    [HttpPut("{id}/avatar")]
    public IActionResult UpdateAvatar(int id, [FromBody] UserUpdateAvatarDto data)
    {
        var result = _userAction.UpdateAvatar(id, data.AvatarUrl);
        if (!result.IsSuccess)
            return BadRequest(result.Message);
        return Ok(result.Message);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var result = _userAction.Delete(id);
        if (!result.IsSuccess)
            return NotFound(result.Message);
        return Ok(result.Message);
    }
}