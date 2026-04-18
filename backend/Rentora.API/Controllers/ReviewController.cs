namespace Rentora.API.Controllers;

using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Rentora.BusinessLayer;
using Rentora.Domain.Models.Review;
using System.Security.Claims;

[Route("api/reviews")]
[ApiController]
public class ReviewController : ControllerBase
{
    private readonly Rentora.BusinessLayer.Interfaces.IReviewAction _reviewAction;

    public ReviewController(IConfiguration config)
    {
        var bl = new BusinessLogic(config);
        _reviewAction = bl.ReviewAction();
    }

    [Authorize]
    [HttpGet]
    public IActionResult GetAll()
    {
        var reviews = _reviewAction.GetAll();
        return Ok(reviews);
    }

    [HttpGet("apartment/{apartmentId}")]
    public IActionResult GetByApartment(int apartmentId)
    {
        var reviews = _reviewAction.GetByApartment(apartmentId);
        return Ok(reviews);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var review = _reviewAction.GetById(id);
        if (review == null)
            return NotFound($"Review with id {id} not found.");
        return Ok(review);
    }
    
    [Authorize]
    [HttpPost("{userId}")]
    public IActionResult Create(int userId, [FromBody] ReviewCreateDto data)
    {
        var result = _reviewAction.Create(userId, data);
        if (!result.IsSuccess)
            return BadRequest(result.Message);
        return Ok(result.Message);
    }
    
    [Authorize]
    [HttpPatch("{id}/owner-response")]
    public IActionResult AddOwnerResponse(int id, [FromBody] string ownerResponse)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = _reviewAction.AddOwnerResponse(id, userId, ownerResponse);
        if (!result.IsSuccess) return BadRequest(result.Message);
        return Ok(result.Message);
    }
    
    [Authorize]
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var result = _reviewAction.Delete(id);
        if (!result.IsSuccess)
            return NotFound(result.Message);
        return Ok(result.Message);
    }
}
