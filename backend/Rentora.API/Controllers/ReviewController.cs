namespace Rentora.API.Controllers;

using Microsoft.AspNetCore.Mvc;
using Rentora.BusinessLayer;
using Rentora.Domain.Models.Review;

[Route("api/reviews")]
[ApiController]
public class ReviewController : ControllerBase
{
    private readonly Rentora.BusinessLayer.Interfaces.IReviewAction _reviewAction;

    public ReviewController()
    {
        var bl = new BusinessLogic();
        _reviewAction = bl.ReviewAction();
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

    [HttpPost("{userId}")]
    public IActionResult Create(int userId, [FromBody] ReviewCreateDto data)
    {
        var result = _reviewAction.Create(userId, data);
        if (!result.IsSuccess)
            return BadRequest(result.Message);
        return Ok(result.Message);
    }

    [HttpPatch("{id}/owner-response")]
    public IActionResult AddOwnerResponse(int id, [FromBody] string ownerResponse)
    {
        var result = _reviewAction.AddOwnerResponse(id, ownerResponse);
        if (!result.IsSuccess)
            return NotFound(result.Message);
        return Ok(result.Message);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var result = _reviewAction.Delete(id);
        if (!result.IsSuccess)
            return NotFound(result.Message);
        return Ok(result.Message);
    }
}
