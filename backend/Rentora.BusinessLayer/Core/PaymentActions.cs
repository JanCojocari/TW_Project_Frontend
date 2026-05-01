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

        if (data.StartDate.HasValue && data.EndDate.HasValue)
        {
            var start = data.StartDate.Value;
            var end   = data.EndDate.Value;

            if (end <= start)
                return new ActionResponse { IsSuccess = false, Message = "End date must be after start date." };

            var overlap = db.Payments.Any(p =>
                p.ApartmentId == data.ApartmentId &&
                p.StartDate.HasValue && p.EndDate.HasValue &&
                p.StartDate < end && p.EndDate > start);

            if (overlap)
                return new ActionResponse { IsSuccess = false, Message = "This period is already booked." };

            var diff = end - start;
            var totalCost = apartment.Interval switch
            {
                Rentora.Domain.Enums.RentInterval.Hour  => apartment.CostPerInterval * (decimal)diff.TotalHours,
                Rentora.Domain.Enums.RentInterval.Day   => apartment.CostPerInterval * (decimal)diff.TotalDays,
                Rentora.Domain.Enums.RentInterval.Month => apartment.CostPerInterval * (decimal)(diff.TotalDays / 30.0),
                _ => apartment.CostPerInterval
            };

            db.Payments.Add(new Payment
            {
                OwnerId     = apartment.OwnedId,
                RenterId    = renterId,
                ApartmentId = data.ApartmentId,
                TotalCost   = Math.Round(totalCost, 2),
                Currency    = data.Currency,
                StartDate   = data.StartDate,
                EndDate     = data.EndDate,
                CreatedAt   = DateTime.UtcNow
            });

            // marcheaza apartamentul ca ocupat
            apartment.RenterId = renterId;

            db.SaveChanges();
            return new ActionResponse { IsSuccess = true, Message = "Payment recorded." };
        }

        // interval orar — fara date calendaristice
        db.Payments.Add(new Payment
        {
            OwnerId     = apartment.OwnedId,
            RenterId    = renterId,
            ApartmentId = data.ApartmentId,
            TotalCost   = apartment.CostPerInterval,
            Currency    = data.Currency,
            StartDate   = null,
            EndDate     = null,
            CreatedAt   = DateTime.UtcNow
        });

        // marcheaza apartamentul ca ocupat
        apartment.RenterId = renterId;

        db.SaveChanges();
        return new ActionResponse { IsSuccess = true, Message = "Payment recorded." };
    }

    protected List<BookedPeriodDto> GetBookedPeriodsExecution(int apartmentId)
    {
        using var db = new AppDbContext();
        return db.Payments
            .Where(p => p.ApartmentId == apartmentId &&
                        p.StartDate.HasValue && p.EndDate.HasValue)
            .Select(p => new BookedPeriodDto
            {
                StartDate = p.StartDate!.Value,
                EndDate   = p.EndDate!.Value
            })
            .ToList();
    }

    protected List<PaymentDto> GetAllExecution()
    {
        using var db = new AppDbContext();
        return db.Payments
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => MapToDto(p))
            .ToList();
    }

    protected ActionResponse DeleteExecution(int id)
    {
        using var db = new AppDbContext();

        var payment = db.Payments.FirstOrDefault(p => p.Id == id);
        if (payment == null)
            return new ActionResponse { IsSuccess = false, Message = "Payment not found." };

        // daca apartamentul exista si e ocupat de acest renter, verifica daca trebuie eliberat
        if (payment.ApartmentId.HasValue && payment.RenterId.HasValue)
        {
            var apartment = db.Apartments.FirstOrDefault(a => a.Id == payment.ApartmentId.Value);
            if (apartment != null && apartment.RenterId == payment.RenterId)
            {
                var now = DateTime.UtcNow;
                // verifica daca mai exista alt payment activ pentru acelasi apartament
                var hasOtherActive = db.Payments.Any(p =>
                    p.Id != id &&
                    p.ApartmentId == payment.ApartmentId &&
                    p.RenterId.HasValue &&
                    (p.EndDate == null || p.EndDate > now));

                if (!hasOtherActive)
                    apartment.RenterId = null;
            }
        }

        db.Payments.Remove(payment);
        db.SaveChanges();
        return new ActionResponse { IsSuccess = true, Message = "Payment deleted." };
    }

    protected ActionResponse ReleaseExpiredExecution()
    {
        using var db = new AppDbContext();

        var now = DateTime.UtcNow;

        // toate apartamentele care au RenterId setat
        var occupiedApartments = db.Apartments
            .Where(a => a.RenterId != null)
            .ToList();

        var released = 0;
        foreach (var apartment in occupiedApartments)
        {
            // apartamentul ramane ocupat doar daca exista un payment activ sau viitor
            var hasActivePayment = db.Payments.Any(p =>
                p.ApartmentId == apartment.Id &&
                p.RenterId.HasValue &&
                (p.EndDate == null || p.EndDate > now));

            if (!hasActivePayment)
            {
                apartment.RenterId = null;
                released++;
            }
        }

        if (released > 0)
            db.SaveChanges();

        return new ActionResponse { IsSuccess = true, Message = $"{released} apartment(s) released." };
    }

    private static PaymentDto MapToDto(Payment p) => new PaymentDto
    {
        Id          = p.Id,
        OwnerId     = p.OwnerId ?? 0,
        RenterId    = p.RenterId ?? 0,
        ApartmentId = p.ApartmentId ?? 0,
        StartDate   = p.StartDate,
        EndDate     = p.EndDate,
        TotalCost   = p.TotalCost,
        Currency    = p.Currency,
        CreatedAt   = p.CreatedAt,
        InvoiceUrl  = p.InvoiceUrl
    };
}