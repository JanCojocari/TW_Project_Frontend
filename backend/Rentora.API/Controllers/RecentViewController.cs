namespace Rentora.API.Controllers;

using Microsoft.AspNetCore.Mvc;
using Rentora.BusinessLayer;

[Route("api/recent-views")]
[ApiController]
public class RecentViewController : ControllerBase
{
    private readonly Rentora.BusinessLayer.Interfaces.IRecentViewAction _recentViewAction;

    public RecentViewController()
    {
        var bl = new BusinessLogic();
        _recentViewAction = bl.RecentViewAction();
    }

    [HttpGet("{userId}")]
    public IActionResult GetByUser(int userId)
    {
        var views = _recentViewAction.GetByUser(userId);
        return Ok(views);
    }

    [HttpPost("{userId}/{apartmentId}")]
    public IActionResult Add(int userId, int apartmentId)
    {
        var result = _recentViewAction.Add(userId, apartmentId);
        if (!result.IsSuccess)
            return BadRequest(result.Message);
        return Ok(result.Message);
    }

    [HttpDelete("{userId}")]
    public IActionResult ClearAll(int userId)
    {
        var result = _recentViewAction.ClearAll(userId);
        return Ok(result.Message);
    }
}
