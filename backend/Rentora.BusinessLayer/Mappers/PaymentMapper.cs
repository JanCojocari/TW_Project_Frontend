namespace Rentora.BusinessLayer.Mappers;

using Rentora.DataAccess;
using Rentora.Domain.Entities;
using Rentora.Domain.Models.Payment;

public static class PaymentMapper
{
    public static PaymentDto ToDto(Payment p, AppDbContext db)
    {
        var apartment = db.Apartments.FirstOrDefault(a => a.Id == p.ApartmentId);
        var renter    = db.Users.FirstOrDefault(u => u.Id == p.RenterId);
        var owner     = db.Users.FirstOrDefault(u => u.Id == p.OwnerId);

        return new PaymentDto
        {
            Id               = p.Id,
            OwnerId          = p.OwnerId     ?? 0,
            RenterId         = p.RenterId    ?? 0,
            ApartmentId      = p.ApartmentId ?? 0,
            StartDate        = p.StartDate,
            EndDate          = p.EndDate,
            TotalCost        = p.TotalCost,
            Currency         = p.Currency.ToString(),
            CreatedAt        = p.CreatedAt,
            InvoiceUrl       = p.InvoiceUrl,
            ApartmentAddress = apartment?.Address ?? "",
            RenterName       = renter?.Name       ?? "",
            RenterSurname    = renter?.Surname    ?? "",
            RenterEmail      = renter?.Email      ?? "",
            OwnerName        = owner != null ? $"{owner.Name} {owner.Surname}" : "Proprietar",
        };
    }
}
