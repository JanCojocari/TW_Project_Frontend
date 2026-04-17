namespace Rentora.API.Controllers;

using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Rentora.BusinessLayer;
using Rentora.Domain.Models.Apartment;

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
        var result = _apartmentAction.Create(ownerId, data);
        if (!result.IsSuccess)
            return BadRequest(result.Message);
        return Ok(result.Message);
    }
    
    [Authorize]
    [HttpPut]
    public IActionResult Update([FromBody] ApartmentUpdateDto data)
    {
        var result = _apartmentAction.Update(data);
        if (!result.IsSuccess)
            return NotFound(result.Message);
        return Ok(result.Message);
    }
    
    [Authorize]
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var result = _apartmentAction.Delete(id);
        if (!result.IsSuccess)
            return NotFound(result.Message);
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
