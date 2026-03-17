namespace Rentora.Api.Controllers;

[APIController]
[Route("api/health")]
public class HealthController: ControllerBase
{
    [HttpGet("check")]
    public IActionResult Check()
    {
        return Ok("Server is up and running");
    }
}