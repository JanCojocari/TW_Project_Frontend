using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Rentora.BusinessLayer.Interfaces;
using System.Security.Claims;

namespace Rentora.API.Controllers;

[ApiController]
[Route("api/stripe")]
[Authorize]
public class StripeController : ControllerBase
{
    private readonly IStripeLogic _stripe;

    public StripeController(IStripeLogic stripe) => _stripe = stripe;

    [HttpPost("create-intent")]
    public async Task<IActionResult> CreateIntent([FromBody] StripeCreateIntentRequest req)
    {
        try
        {
            var clientSecret = await _stripe.CreatePaymentIntentAsync(req.Amount, req.Currency);
            return Ok(new { clientSecret });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpPost("confirm")]
    public async Task<IActionResult> Confirm([FromBody] StripeConfirmRequest req)
    {
        try
        {
            // extrage renterId din JWT
            var renterIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(renterIdClaim, out var renterId))
                return Unauthorized();

            var transactionId = await _stripe.ConfirmPaymentAsync(
                req.PaymentIntentId, req.ApartmentId, renterId,
                req.Amount, req.Currency,
                req.StartDate, req.EndDate);

            return Ok(new { success = true, transactionId });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }
}

public record StripeCreateIntentRequest(decimal Amount, string Currency);
public record StripeConfirmRequest(
    string PaymentIntentId,
    int ApartmentId,
    decimal Amount,
    string Currency,
    DateTime? StartDate,
    DateTime? EndDate);