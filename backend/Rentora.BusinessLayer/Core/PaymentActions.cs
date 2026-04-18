namespace Rentora.BusinessLayer.Core;

using Rentora.DataAccess;
using Rentora.Domain.Entities;
using Rentora.Domain.Models.Payment;
using Rentora.Domain.Models.Responses;

public class PaymentActions
{
    protected PaymentActions() { }

    protected List<PaymentDto> GetByUserExecution(int userId)
    {
        using var db = new AppDbContext();

        return db.Payments
            .Where(p => p.RenterId == userId || p.OwnerId == userId)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => MapToDto(p))
            .ToList();
    }
    
    protected List<PaymentDto> GetByOwnerExecution(int ownerId)
    {
        using var db = new AppDbContext();
        return db.Payments
            .Where(p => p.OwnerId == ownerId)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => MapToDto(p))
            .ToList();
    }

    protected List<PaymentDto> GetByRenterExecution(int renterId)
    {
        using var db = new AppDbContext();
        return db.Payments
            .Where(p => p.RenterId == renterId)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => MapToDto(p))
            .ToList();
    }

    protected List<PaymentDto> GetByApartmentExecution(int apartmentId)
    {
        using var db = new AppDbContext();

        return db.Payments
            .Where(p => p.ApartmentId == apartmentId)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => MapToDto(p))
            .ToList();
    }

    protected PaymentDto? GetByIdExecution(int id)
    {
        using var db = new AppDbContext();

        var payment = db.Payments.FirstOrDefault(p => p.Id == id);
        if (payment == null) return null;

        return MapToDto(payment);
    }

    protected ActionResponse CreateExecution(int renterId, PaymentCreateDto data)
    {
        using var db = new AppDbContext();

        var renterExists = db.Users.Any(u => u.Id == renterId);
        if (!renterExists)
            return new ActionResponse { IsSuccess = false, Message = "Renter not found." };

        var apartment = db.Apartments.FirstOrDefault(a => a.Id == data.ApartmentId);
        if (apartment == null)
            return new ActionResponse { IsSuccess = false, Message = "Apartment not found." };

        var payment = new Payment
        {
            OwnerId     = apartment.OwnedId,
            RenterId    = renterId,
            ApartmentId = data.ApartmentId,
            TotalCost   = apartment.CostPerInterval,
            Currency    = data.Currency,
            CreatedAt   = DateTime.UtcNow
        };

        db.Payments.Add(payment);
        db.SaveChanges();

        return new ActionResponse { IsSuccess = true, Message = "Payment recorded." };
    }
    
    protected List<PaymentDto> GetAllExecution()
    {
        using var db = new AppDbContext();
        return db.Payments
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => MapToDto(p))
            .ToList();
    }

    private static PaymentDto MapToDto(Payment p) => new PaymentDto
    {
        Id          = p.Id,
        OwnerId     = p.OwnerId ?? 0,
        RenterId    = p.RenterId ?? 0,
        ApartmentId = p.ApartmentId ?? 0,
        TotalCost   = p.TotalCost,
        Currency    = p.Currency,
        CreatedAt   = p.CreatedAt,
        InvoiceUrl  = p.InvoiceUrl
    };
}
