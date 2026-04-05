namespace Rentora.BusinessLayer.Core;

using Rentora.DataAccess;
using Rentora.Domain.Entities;
using Rentora.Domain.Models.Apartment;
using Rentora.Domain.Models.Responses;
using Rentora.Domain.OwnedTypes;

public class ApartmentActions
{
    protected ApartmentActions() { }

    protected List<ApartmentDto> GetAllExecution()
    {
        using var db = new AppDbContext();

        return db.Apartments
            .Select(a => MapToDto(a))
            .ToList();
    }

    protected ApartmentDto? GetByIdExecution(int id)
    {
        using var db = new AppDbContext();

        var apartment = db.Apartments.FirstOrDefault(a => a.Id == id);
        if (apartment == null) return null;

        return MapToDto(apartment);
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

        return new ActionResponse { IsSuccess = true, Message = "Apartment created." };
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

    private static ApartmentDto MapToDto(Apartment a) => new ApartmentDto
    {
        Id = a.Id,
        OwnedId = a.OwnedId,
        RenterId = a.RenterId,
        Address = a.Address,
        ImageUrl = a.ImageUrl,
        Interval = a.Interval,
        CostPerInterval = a.CostPerInterval,
        RentMode = a.RentMode,
        Location = a.Location,
        AdditionalInfo = a.AdditionlaInfo
    };
}
