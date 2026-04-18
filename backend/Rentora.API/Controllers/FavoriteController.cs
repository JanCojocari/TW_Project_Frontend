namespace Rentora.API.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Rentora.BusinessLayer;

[Route("api/favorites")]
[ApiController]
[Authorize]
public class FavoriteController : ControllerBase
{
    private readonly BusinessLogic _bl;

    public FavoriteController(IConfiguration config)
    {
        _bl = new BusinessLogic(config);
    }

    [HttpGet("{userId}")]
    public IActionResult GetByUser(int userId)
    {
        var favorites = _bl.FavoriteAction().GetByUser(userId);
        return Ok(favorites);
    }

    [HttpPost("{userId}/{apartmentId}")]
    public IActionResult Add(int userId, int apartmentId)
    {
        var result = _bl.FavoriteAction().Add(userId, apartmentId);
        if (!result.IsSuccess) return BadRequest(result.Message);
        return Ok(result.Message);
    }

    [HttpDelete("{userId}/{apartmentId}")]
    public IActionResult Remove(int userId, int apartmentId)
    {
        var result = _bl.FavoriteAction().Remove(userId, apartmentId);
        if (!result.IsSuccess) return NotFound(result.Message);
        return Ok(result.Message);
    }
}