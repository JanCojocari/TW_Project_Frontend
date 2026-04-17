namespace Rentora.API.Controllers;

using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Rentora.BusinessLayer;
using Rentora.Domain.Models.SupportRequest;

[Route("api/support")]
[ApiController]
public class SupportRequestController : ControllerBase
{
    private readonly Rentora.BusinessLayer.Interfaces.ISupportRequestAction _supportAction;

    public SupportRequestController(IConfiguration config)
    {
        var bl = new BusinessLogic(config);
        _supportAction = bl.SupportRequestAction();
    }

    [HttpPost]
    public IActionResult Create([FromBody] SupportRequestCreateDto data)
    {
        var result = _supportAction.Create(data);
        if (!result.IsSuccess)
            return BadRequest(result.Message);
        return Ok(result.Message);
    }

    [Authorize]
    [HttpGet]
    public IActionResult GetAll()
    {
        var requests = _supportAction.GetAll();
        return Ok(requests);
    }

    [Authorize]
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var request = _supportAction.GetById(id);
        if (request == null)
            return NotFound($"Support request with id {id} not found.");
        return Ok(request);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var result = _supportAction.Delete(id);
        if (!result.IsSuccess)
            return NotFound(result.Message);
        return Ok(result.Message);
    }

    [Authorize]
    [HttpPatch("{id}/status")]
    public IActionResult UpdateStatus(int id, [FromBody] string status)
    {
        var result = _supportAction.UpdateStatus(id, status);
        if (!result.IsSuccess)
            return BadRequest(result.Message);
        return Ok(result.Message);
    }
}