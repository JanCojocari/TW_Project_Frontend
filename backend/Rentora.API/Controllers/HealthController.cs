using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;

namespace Rentora.Api.Controllers;

[ApiController]
[Route("api/health")]
public class HealthController: ControllerBase
{
    [HttpGet("check")]
    public IActionResult Check()
    {
        return Ok("Server is up and running");
    }
}