namespace Rentora.API.Controllers;

using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Rentora.BusinessLayer;
using Rentora.Domain.Models.Apartment;
using Rentora.Domain.Models;

[Route("api/apartments")]
[ApiController]
public class ApartmentController : ControllerBase
{
    private readonly Rentora.BusinessLayer.Interfaces.IApartmentAction _apartmentAction;

    public ApartmentController(IConfiguration config)
    {
        var bl = new BusinessLogic(config);
        _apartmentAction = bl.ApartmentAction();
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var apartments = _apartmentAction.GetAll();
        return Ok(apartments);
    }

    [HttpGet("paged")]
    public IActionResult GetPaged([FromQuery] ApartmentQueryParams p)
    {
        var result = _apartmentAction.GetPaged(p);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var apartment = _apartmentAction.GetById(id);
        if (apartment == null)
            return NotFound($"Apartment with id {id} not found.");
        return Ok(apartment);
    }

    [HttpGet("owner/{ownerId}")]
    public IActionResult GetByOwner(int ownerId)
    {
        var apartments = _apartmentAction.GetByOwner(ownerId);
        return Ok(apartments);
    }

    [Authorize]
    [HttpPost("{ownerId}")]
    public IActionResult Create(int ownerId, [FromBody] ApartmentCreateDto data)
    {
        var callerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        if (ownerId != callerId)
            return StatusCode(403, new { message = "Forbidden." });
        var result = _apartmentAction.Create(callerId, data);
        if (!result.IsSuccess)
            return BadRequest(result.Message);
        return Ok(result);
    }

    [Authorize]
    [HttpPut]
    public IActionResult Update([FromBody] ApartmentUpdateDto data)
    {
        var callerId   = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var callerRole = int.Parse(User.FindFirstValue(ClaimTypes.Role) ?? "1");
        var result = _apartmentAction.Update(data, callerId, callerRole);
        if (!result.IsSuccess)
        {
            if (result.Message == "Forbidden.")
                return StatusCode(403, new { message = result.Message });
            if (result.Message != null && result.Message.Contains("booking"))
                return BadRequest(new { message = result.Message });
            return NotFound(new { message = result.Message });
        }
        return Ok(result.Message);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var callerId   = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var callerRole = int.Parse(User.FindFirstValue(ClaimTypes.Role) ?? "1");
        var result = _apartmentAction.Delete(id, callerId, callerRole);
        if (!result.IsSuccess)
        {
            if (result.Message == "Forbidden.")
                return StatusCode(403, new { message = result.Message });
            if (result.Message != null && result.Message.Contains("booking"))
                return BadRequest(new { message = result.Message });
            return NotFound(new { message = result.Message });
        }
        return Ok(result.Message);
    }

    [Authorize]
    [HttpPatch("{apartmentId}/renter/{renterId}")]
    public IActionResult AssignRenter(int apartmentId, int renterId)
    {
        var result = _apartmentAction.AssignRenter(apartmentId, renterId);
        if (!result.IsSuccess)
            return BadRequest(result.Message);
        return Ok(result.Message);
    }

    [Authorize]
    [HttpPatch("{apartmentId}/renter/remove")]
    public IActionResult RemoveRenter(int apartmentId)
    {
        var result = _apartmentAction.RemoveRenter(apartmentId);
        if (!result.IsSuccess)
            return NotFound(result.Message);
        return Ok(result.Message);
    }

    [HttpGet("pending")]
    public IActionResult GetPending()
    {
        var apartments = _apartmentAction.GetPending();
        return Ok(apartments);
    }

    [Authorize]
    [HttpPatch("{id}/approve")]
    public IActionResult Approve(int id)
    {
        var result = _apartmentAction.Approve(id);
        if (!result.IsSuccess)
            return NotFound(result.Message);
        return Ok(result.Message);
    }

    [Authorize]
    [HttpPatch("{id}/decline")]
    public IActionResult Decline(int id)
    {
        var result = _apartmentAction.Decline(id);
        if (!result.IsSuccess)
            return NotFound(result.Message);
        return Ok(result.Message);
    }
}