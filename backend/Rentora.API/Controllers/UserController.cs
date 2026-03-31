namespace Rentora.API.Controllers;

using Microsoft.AspNetCore.Mvc;
using Rentora.BusinessLayer;
using Rentora.Domain.Models.User;

[Route("api/users")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly Rentora.BusinessLayer.Interfaces.IUserAction _userAction;

    public UserController()
    {
        var bl = new BusinessLogic();
        _userAction = bl.UserAction();
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var users = _userAction.GetAll();
        return Ok(users);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var user = _userAction.GetById(id);
        if (user == null)
            return NotFound($"User with id {id} not found.");
        return Ok(user);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] UserUpdateDto data)
    {
        var result = _userAction.Update(id, data);
        if (!result.IsSuccess)
            return BadRequest(result.Message);
        return Ok(result.Message);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var result = _userAction.Delete(id);
        if (!result.IsSuccess)
            return NotFound(result.Message);
        return Ok(result.Message);
    }
}