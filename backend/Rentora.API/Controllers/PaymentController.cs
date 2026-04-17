namespace Rentora.API.Controllers;

using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Rentora.BusinessLayer;
using Rentora.Domain.Models.Payment;

[Route("api/payments")]
[ApiController]
public class PaymentController : ControllerBase
{
    private readonly Rentora.BusinessLayer.Interfaces.IPaymentAction _paymentAction;

    public PaymentController(IConfiguration config)
    {
        var bl = new BusinessLogic(config);
        _paymentAction = bl.PaymentAction();
    }
    
    [Authorize]
    [HttpGet("user/{userId}")]
    public IActionResult GetByUser(int userId)
    {
        var payments = _paymentAction.GetByUser(userId);
        return Ok(payments);
    }
    
    [Authorize]
    [HttpGet("apartment/{apartmentId}")]
    public IActionResult GetByApartment(int apartmentId)
    {
        var payments = _paymentAction.GetByApartment(apartmentId);
        return Ok(payments);
    }
    
    [Authorize]
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var payment = _paymentAction.GetById(id);
        if (payment == null)
            return NotFound($"Payment with id {id} not found.");
        return Ok(payment);
    }

    [Authorize]
    [HttpPost("{renterId}")]
    public IActionResult Create(int renterId, [FromBody] PaymentCreateDto data)
    {
        var result = _paymentAction.Create(renterId, data);
        if (!result.IsSuccess)
            return BadRequest(result.Message);
        return Ok(result.Message);
    }
}
