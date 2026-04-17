using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Rentora.BusinessLayer.Interfaces;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;

namespace Rentora.API.Controllers;

[ApiController]
[Route("api/paypal")]
[AllowAnonymous] //de schimbat in [Authorize] cand implementam JWT
public class PayPalController : ControllerBase
{
    private readonly IPayPalLogic _paypal;

    public PayPalController(IPayPalLogic paypal) => _paypal = paypal;

    [HttpPost("create-order")]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest req)
    {
        try
        {
            var orderId = await _paypal.CreateOrderAsync(req.Amount, req.Currency);
            return Ok(new { orderId });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }
    
    // de facut sa se extrage renterId din JWT
    [HttpPost("capture-order/{paypalOrderId}")]
    public async Task<IActionResult> CaptureOrder(
        string paypalOrderId, [FromBody] CaptureOrderRequest req)
    {
        try
        {
            var transactionId = await _paypal.CaptureOrderAsync(
                paypalOrderId, req.ApartmentId, req.RenterId, req.Amount, req.Currency);

            return Ok(new { success = true, transactionId });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }
}

public record CreateOrderRequest(decimal Amount, string Currency);
public record CaptureOrderRequest(int ApartmentId, int RenterId, decimal Amount, string Currency);
