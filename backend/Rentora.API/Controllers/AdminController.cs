namespace Rentora.API.Controllers;

using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Rentora.BusinessLayer;
using Rentora.DataAccess;
using Rentora.Domain.Enums;
using Rentora.Domain.Models.Apartment;
using Rentora.Domain.Models.User;

[Route("api/admin")]
[ApiController]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly BusinessLogic _bl;

    public AdminController(IConfiguration config)
    {
        _bl = new BusinessLogic(config);
    }

    // ── STATS ────────────────────────────────────────────────────────────────

    [HttpGet("stats")]
    public IActionResult GetStats()
    {
        using var db = new AppDbContext();
        return Ok(new
        {
            TotalUsers             = db.Users.Count(),
            TotalApartments        = db.Apartments.Count(),
            PendingApartments      = db.Apartments.Count(a => a.Status == ApartmentStatus.Pending),
            ApprovedApartments     = db.Apartments.Count(a => a.Status == ApartmentStatus.Approved),
            DeclinedApartments     = db.Apartments.Count(a => a.Status == ApartmentStatus.Declined),
            TotalPayments          = db.Payments.Count(),
            TotalReviews           = db.Reviews.Count(),
            TotalSupportRequests   = db.SupportRequests.Count(),
            OpenSupportRequests    = db.SupportRequests.Count(s => s.Status == SupportStatus.Open),
        });
    }

    // ── USER MANAGEMENT ──────────────────────────────────────────────────────

    [HttpGet("users")]
    public IActionResult GetAllUsers()
    {
        var users = _bl.UserAction().GetAll();
        return Ok(users);
    }

    [HttpGet("users/{id}")]
    public IActionResult GetUserById(int id)
    {
        var user = _bl.UserAction().GetById(id);
        if (user == null) return NotFound($"User {id} not found.");
        return Ok(user);
    }

    [HttpPut("users/{id}")]
    public IActionResult UpdateUser(int id, [FromBody] UserUpdateDto data)
    {
        var result = _bl.UserAction().Update(id, data);
        if (!result.IsSuccess) return BadRequest(result.Message);
        return Ok(result.Message);
    }

    [HttpDelete("users/{id}")]
    public IActionResult DeleteUser(int id)
    {
        var result = _bl.UserAction().Delete(id);
        if (!result.IsSuccess) return NotFound(result.Message);
        return Ok(result.Message);
    }

    [HttpPatch("users/{id}/role")]
    public IActionResult UpdateUserRole(int id, [FromBody] int role)
    {
        var result = _bl.UserAction().UpdateRole(id, role);
        if (!result.IsSuccess) return BadRequest(result.Message);
        return Ok(result.Message);
    }

    // ── LISTING MANAGEMENT ───────────────────────────────────────────────────

    [HttpGet("apartments")]
    public IActionResult GetAllApartments()
    {
        using var db = new AppDbContext();
        var apartments = db.Apartments
            .Include(a => a.Owner)
            .OrderByDescending(a => a.Id)
            .ToList()
            .Select(a => new {
                a.Id, a.OwnedId, a.RenterId, a.Address, a.ImageUrl,
                a.Interval, a.CostPerInterval, a.Currency, a.RentMode, a.Status,
                a.Location, a.AdditionlaInfo,
                OwnerName    = a.Owner?.Name    ?? string.Empty,
                OwnerSurname = a.Owner?.Surname ?? string.Empty,
                OwnerEmail   = a.Owner?.Email   ?? string.Empty,
            });
        return Ok(apartments);
    }

    [HttpGet("apartments/pending")]
    public IActionResult GetPendingApartments()
    {
        var apartments = _bl.ApartmentAction().GetPending();
        return Ok(apartments);
    }

    [HttpGet("apartments/{id}")]
    public IActionResult GetApartmentById(int id)
    {
        var apartment = _bl.ApartmentAction().GetById(id);
        if (apartment == null) return NotFound($"Apartment {id} not found.");
        return Ok(apartment);
    }

    [HttpPut("apartments/{id}")]
    public IActionResult UpdateApartment([FromBody] ApartmentUpdateDto data)
    {
        var result = _bl.ApartmentAction().Update(data);
        if (!result.IsSuccess) return NotFound(result.Message);
        return Ok(result.Message);
    }

    [HttpDelete("apartments/{id}")]
    public IActionResult DeleteApartment(int id)
    {
        var result = _bl.ApartmentAction().Delete(id);
        if (!result.IsSuccess) return NotFound(result.Message);
        return Ok(result.Message);
    }

    [HttpPatch("apartments/{id}/approve")]
    public IActionResult ApproveApartment(int id)
    {
        var result = _bl.ApartmentAction().Approve(id);
        if (!result.IsSuccess) return NotFound(result.Message);
        return Ok(result.Message);
    }

    [HttpPatch("apartments/{id}/decline")]
    public IActionResult DeclineApartment(int id)
    {
        var result = _bl.ApartmentAction().Decline(id);
        if (!result.IsSuccess) return NotFound(result.Message);
        return Ok(result.Message);
    }

    // ── SUPPORT MANAGEMENT ───────────────────────────────────────────────────

    [HttpGet("support")]
    public IActionResult GetAllSupport()
    {
        var requests = _bl.SupportRequestAction().GetAll();
        return Ok(requests);
    }

    [HttpGet("support/{id}")]
    public IActionResult GetSupportById(int id)
    {
        var request = _bl.SupportRequestAction().GetById(id);
        if (request == null) return NotFound($"Support request {id} not found.");
        return Ok(request);
    }

    [HttpPatch("support/{id}/status")]
    public IActionResult UpdateSupportStatus(int id, [FromBody] string status)
    {
        var result = _bl.SupportRequestAction().UpdateStatus(id, status);
        if (!result.IsSuccess) return BadRequest(result.Message);
        return Ok(result.Message);
    }

    [HttpDelete("support/{id}")]
    public IActionResult DeleteSupport(int id)
    {
        var result = _bl.SupportRequestAction().Delete(id);
        if (!result.IsSuccess) return NotFound(result.Message);
        return Ok(result.Message);
    }

    // ── REVIEW MANAGEMENT ────────────────────────────────────────────────────

    [HttpGet("reviews")]
    public IActionResult GetAllReviews()
    {
        var reviews = _bl.ReviewAction().GetAll();
        return Ok(reviews);
    }

    [HttpDelete("reviews/{id}")]
    public IActionResult DeleteReview(int id)
    {
        var result = _bl.ReviewAction().Delete(id);
        if (!result.IsSuccess) return NotFound(result.Message);
        return Ok(result.Message);
    }

    // ── PAYMENT MANAGEMENT ───────────────────────────────────────────────────

    [HttpGet("payments")]
    public IActionResult GetAllPayments()
    {
        var payments = _bl.PaymentAction().GetAll();
        return Ok(payments);
    }

    [HttpGet("payments/owner/{ownerId}")]
    public IActionResult GetPaymentsByOwner(int ownerId)
    {
        var payments = _bl.PaymentAction().GetByOwner(ownerId);
        return Ok(payments);
    }

    [HttpGet("payments/renter/{renterId}")]
    public IActionResult GetPaymentsByRenter(int renterId)
    {
        var payments = _bl.PaymentAction().GetByRenter(renterId);
        return Ok(payments);
    }

    [HttpGet("payments/apartment/{apartmentId}")]
    public IActionResult GetPaymentsByApartment(int apartmentId)
    {
        var payments = _bl.PaymentAction().GetByApartment(apartmentId);
        return Ok(payments);
    }

    // elibereaza manual apartamentele cu EndDate expirat (util pentru debug/fix rapid)
    [HttpPost("payments/release-expired")]
    public IActionResult ReleaseExpiredApartments()
    {
        var result = _bl.PaymentAction().ReleaseExpired();
        return Ok(result.Message);
    }
}