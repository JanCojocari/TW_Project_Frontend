namespace Rentora.BusinessLayer.Core;

using Microsoft.EntityFrameworkCore;
using Rentora.DataAccess;
using Rentora.Domain.Entities;
using Rentora.Domain.Models;
using Rentora.Domain.Models.Apartment;
using Rentora.Domain.Models.Facilities;
using Rentora.Domain.Models.Responses;
using Rentora.Domain.OwnedTypes;
using Rentora.Domain.Enums;

public class ApartmentActions
{
    protected ApartmentActions() { }

    protected List<ApartmentDto> GetAllExecution()
    {
        using var db = new AppDbContext();

        var apartments = db.Apartments
            .Include(a => a.Facilities)
            .Where(a => a.Status == ApartmentStatus.Approved && a.RenterId == null)
            .ToList();

        if (!apartments.Any()) return new List<ApartmentDto>();

        var ids = apartments.Select(a => a.Id).ToList();
        var reviewStats = db.Reviews
            .Where(r => ids.Contains(r.ApartmentId))
            .GroupBy(r => r.ApartmentId)
            .Select(g => new { ApartmentId = g.Key, Count = g.Count(), Avg = g.Average(r => (double)r.Rating) })
            .ToDictionary(x => x.ApartmentId);

        return apartments.Select(a => {
            var dto = MapToDto(a);
            if (reviewStats.TryGetValue(a.Id, out var stats)) {
                dto.ReviewCount = stats.Count;
                dto.AvgRating   = Math.Round(stats.Avg, 1);
            }
            return dto;
        }).ToList();
    }
    
    protected PagedResult<ApartmentDto> GetPagedExecution(ApartmentQueryParams p)
    {
        using var db = new AppDbContext();

        var page     = Math.Max(1, p.Page);
        var pageSize = Math.Clamp(p.PageSize, 1, 100);

        IQueryable<Apartment> query = db.Apartments
            .Include(a => a.Facilities)
            .Where(a => a.Status == ApartmentStatus.Approved);

        // Availability (default: available only, "ALL" = no filter)
        if (p.Availability == "occupied")
            query = query.Where(a => a.RenterId != null);
        else if (p.Availability != "ALL")
            query = query.Where(a => a.RenterId == null);

        // Search (address)
        if (!string.IsNullOrWhiteSpace(p.Search))
            query = query.Where(a => a.Address.Contains(p.Search));

        // City (location or address)
        if (!string.IsNullOrWhiteSpace(p.City))
            query = query.Where(a =>
                (a.Location.City != null && a.Location.City.Contains(p.City)) ||
                a.Address.Contains(p.City));

        // Currency
        if (!string.IsNullOrWhiteSpace(p.Currency) && p.Currency != "ALL" &&
            Enum.TryParse<Currency>(p.Currency, true, out var currency))
            query = query.Where(a => a.Currency == currency);

        // Interval
        var intervalMap = new Dictionary<string, RentInterval>(StringComparer.OrdinalIgnoreCase)
        {
            ["hour"]  = RentInterval.Hour,
            ["day"]   = RentInterval.Day,
            ["month"] = RentInterval.Month,
        };
        if (!string.IsNullOrWhiteSpace(p.Interval) && p.Interval != "ALL" &&
            intervalMap.TryGetValue(p.Interval, out var interval))
            query = query.Where(a => a.Interval == interval);

        // Price
        if (p.MinPrice.HasValue) query = query.Where(a => a.CostPerInterval >= p.MinPrice.Value);
        if (p.MaxPrice.HasValue) query = query.Where(a => a.CostPerInterval <= p.MaxPrice.Value);

        // Facilities
        if (p.Wifi            == true) query = query.Where(a => a.Facilities != null && a.Facilities.Wifi);
        if (p.Parking         == true) query = query.Where(a => a.Facilities != null && a.Facilities.Parking);
        if (p.AirConditioning == true) query = query.Where(a => a.Facilities != null && a.Facilities.AirConditioning);
        if (p.Heating         == true) query = query.Where(a => a.Facilities != null && a.Facilities.Heating);
        if (p.Washer          == true) query = query.Where(a => a.Facilities != null && a.Facilities.Washer);
        if (p.Dryer           == true) query = query.Where(a => a.Facilities != null && a.Facilities.Dryer);
        if (p.Kitchen         == true) query = query.Where(a => a.Facilities != null && a.Facilities.Kitchen);
        if (p.TV              == true) query = query.Where(a => a.Facilities != null && a.Facilities.TV);
        if (p.Pool            == true) query = query.Where(a => a.Facilities != null && a.Facilities.Pool);
        if (p.Gym             == true) query = query.Where(a => a.Facilities != null && a.Facilities.Gym);
        if (p.Elevator        == true) query = query.Where(a => a.Facilities != null && a.Facilities.Elevator);
        if (p.PetsAllowed     == true) query = query.Where(a => a.Facilities != null && a.Facilities.PetsAllowed);
        if (p.Balcony         == true) query = query.Where(a => a.Facilities != null && a.Facilities.Balcony);

        // Rating/review filters — correlated subquery (computed in SQL)
        if (p.MinReviews.HasValue)
            query = query.Where(a => db.Reviews.Count(r => r.ApartmentId == a.Id) >= p.MinReviews.Value);
        if (p.MinRating.HasValue)
            query = query.Where(a =>
                db.Reviews.Any(r => r.ApartmentId == a.Id) &&
                db.Reviews.Where(r => r.ApartmentId == a.Id).Average(r => (double)r.Rating) >= p.MinRating.Value);

        var totalCount = query.Count();

        var apartments = query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        var ids = apartments.Select(a => a.Id).ToList();
        var reviewStats = db.Reviews
            .Where(r => ids.Contains(r.ApartmentId))
            .GroupBy(r => r.ApartmentId)
            .Select(g => new { ApartmentId = g.Key, Count = g.Count(), Avg = g.Average(r => (double)r.Rating) })
            .ToDictionary(x => x.ApartmentId);

        return new PagedResult<ApartmentDto>
        {
            Items = apartments.Select(a => {
                var dto = MapToDto(a);
                if (reviewStats.TryGetValue(a.Id, out var stats))
                {
                    dto.ReviewCount = stats.Count;
                    dto.AvgRating   = Math.Round(stats.Avg, 1);
                }
                return dto;
            }).ToList(),
            TotalCount = totalCount,
            Page       = page,
            PageSize   = pageSize,
        };
    }

    protected List<ApartmentDto> GetAllForAdminExecution()
    {
        using var db = new AppDbContext();
        return db.Apartments
            .Select(a => MapToDto(a))
            .ToList();
    }

    protected ApartmentDto? GetByIdExecution(int id)
    {
        using var db = new AppDbContext();

        var apartment = db.Apartments
            .Include(a => a.Facilities)
            .FirstOrDefault(a => a.Id == id);
        if (apartment == null) return null;

        var dto = MapToDto(apartment);

        var ratings = db.Reviews
            .Where(r => r.ApartmentId == id)
            .Select(r => r.Rating)
            .ToList();
        dto.ReviewCount = ratings.Count;
        dto.AvgRating   = ratings.Any() ? Math.Round(ratings.Average(), 1) : 0;

        return dto;
    }

    protected List<ApartmentDto> GetByOwnerExecution(int ownerId)
    {
        using var db = new AppDbContext();

        return db.Apartments
            .Where(a => a.OwnedId == ownerId)
            .Select(a => MapToDto(a))
            .ToList();
    }

    protected ActionResponse CreateExecution(int ownerId, ApartmentCreateDto data)
    {
        using var db = new AppDbContext();

        var ownerExists = db.Users.Any(u => u.Id == ownerId);
        if (!ownerExists)
            return new ActionResponse { IsSuccess = false, Message = "Owner not found." };

        var apartment = new Apartment
        {
            OwnedId = ownerId,
            Address = data.Address,
            ImageUrl = data.ImageUrl,
            Interval = data.Interval,
            CostPerInterval = data.CostPerInterval,
            Currency = data.Currency,
            RentMode = data.RentMode,
            Location = data.Location ?? new MapLocation(),
            AdditionlaInfo = data.AdditionalInfo ?? new AdditionalInfo()
        };

        db.Apartments.Add(apartment);
        db.SaveChanges();

        // creeaza Facilities gol asociat
        var facilities = new Facilities { ApartmentId = apartment.Id };
        db.Facilities.Add(facilities);
        db.SaveChanges();

        return new ActionResponse { IsSuccess = true, Message = "Apartment created.", Id = apartment.Id };
    }

    protected ActionResponse UpdateExecution(ApartmentUpdateDto data)
    {
        using var db = new AppDbContext();

        var apartment = db.Apartments.FirstOrDefault(a => a.Id == data.Id);
        if (apartment == null)
            return new ActionResponse { IsSuccess = false, Message = "Apartment not found." };

        apartment.Address = data.Address;
        apartment.ImageUrl = data.ImageUrl;
        apartment.Interval = data.Interval;
        apartment.CostPerInterval = data.CostPerInterval;
        apartment.Currency = data.Currency;
        apartment.RentMode = data.RentMode;
        apartment.Location = data.Location ?? new MapLocation();
        apartment.AdditionlaInfo = data.AdditionalInfo ?? new AdditionalInfo();

        db.Apartments.Update(apartment);
        db.SaveChanges();

        return new ActionResponse { IsSuccess = true, Message = "Apartment updated." };
    }

    protected ActionResponse DeleteExecution(int id)
    {
        using var db = new AppDbContext();

        var apartment = db.Apartments.FirstOrDefault(a => a.Id == id);
        if (apartment == null)
            return new ActionResponse { IsSuccess = false, Message = "Apartment not found." };

        var payments = db.Payments.Where(p => p.ApartmentId == id).ToList();
        foreach (var p in payments) p.ApartmentId = null;

        db.Apartments.Remove(apartment);
        db.SaveChanges();

        return new ActionResponse { IsSuccess = true, Message = "Apartment deleted." };
    }

    protected ActionResponse AssignRenterExecution(int apartmentId, int renterId)
    {
        using var db = new AppDbContext();

        var apartment = db.Apartments.FirstOrDefault(a => a.Id == apartmentId);
        if (apartment == null)
            return new ActionResponse { IsSuccess = false, Message = "Apartment not found." };

        var renterExists = db.Users.Any(u => u.Id == renterId);
        if (!renterExists)
            return new ActionResponse { IsSuccess = false, Message = "Renter not found." };

        apartment.RenterId = renterId;
        db.Apartments.Update(apartment);
        db.SaveChanges();

        return new ActionResponse { IsSuccess = true, Message = "Renter assigned." };
    }

    protected ActionResponse RemoveRenterExecution(int apartmentId)
    {
        using var db = new AppDbContext();

        var apartment = db.Apartments.FirstOrDefault(a => a.Id == apartmentId);
        if (apartment == null)
            return new ActionResponse { IsSuccess = false, Message = "Apartment not found." };

        apartment.RenterId = null;
        db.Apartments.Update(apartment);
        db.SaveChanges();

        return new ActionResponse { IsSuccess = true, Message = "Renter removed." };
    }

    protected List<ApartmentDto> GetPendingExecution()
    {
        using var db = new AppDbContext();
        return db.Apartments
            .Where(a => a.Status == Rentora.Domain.Enums.ApartmentStatus.Pending)
            .Select(a => MapToDto(a))
            .ToList();
    }

    protected ActionResponse ApproveExecution(int id)
    {
        using var db = new AppDbContext();
        var apartment = db.Apartments.FirstOrDefault(a => a.Id == id);
        if (apartment == null)
            return new ActionResponse { IsSuccess = false, Message = "Apartment not found." };

        apartment.Status = Rentora.Domain.Enums.ApartmentStatus.Approved;
        db.Apartments.Update(apartment);
        db.SaveChanges();
        return new ActionResponse { IsSuccess = true, Message = "Apartment approved." };
    }

    protected ActionResponse DeclineExecution(int id)
    {
        using var db = new AppDbContext();
        var apartment = db.Apartments.FirstOrDefault(a => a.Id == id);
        if (apartment == null)
            return new ActionResponse { IsSuccess = false, Message = "Apartment not found." };

        apartment.Status = Rentora.Domain.Enums.ApartmentStatus.Declined;
        db.Apartments.Update(apartment);
        db.SaveChanges();
        return new ActionResponse { IsSuccess = true, Message = "Apartment declined." };
    }

    private static ApartmentDto MapToDto(Apartment a) => new ApartmentDto
    {
        Id              = a.Id,
        OwnedId         = a.OwnedId,
        RenterId        = a.RenterId,
        Address         = a.Address,
        ImageUrl        = a.ImageUrl,
        Interval        = a.Interval,
        CostPerInterval = a.CostPerInterval,
        Currency        = a.Currency,
        RentMode        = a.RentMode,
        Status          = a.Status,
        Location        = a.Location,
        AdditionalInfo  = a.AdditionlaInfo,
        Facilities      = a.Facilities != null ? new FacilitiesDto
        {
            ApartmentId     = a.Facilities.ApartmentId,
            Wifi            = a.Facilities.Wifi,
            Parking         = a.Facilities.Parking,
            AirConditioning = a.Facilities.AirConditioning,
            Heating         = a.Facilities.Heating,
            Washer          = a.Facilities.Washer,
            Dryer           = a.Facilities.Dryer,
            Kitchen         = a.Facilities.Kitchen,
            Tv              = a.Facilities.TV,
            Pool            = a.Facilities.Pool,
            Gym             = a.Facilities.Gym,
            Elevator        = a.Facilities.Elevator,
            PetsAllowed     = a.Facilities.PetsAllowed,
            Balcony         = a.Facilities.Balcony,
        } : null,
    };
}