namespace Rentora.BusinessLayer.Mappers;

using Rentora.Domain.Entities;
using Rentora.Domain.Models.Apartment;
using Rentora.Domain.Models.Facilities;

public static class ApartmentMapper
{
    public static ApartmentDto ToDto(Apartment a) => new ApartmentDto
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
        Facilities      = a.Facilities != null ? MapFacilities(a.Facilities) : null,
    };

    private static FacilitiesDto MapFacilities(Facilities f) => new FacilitiesDto
    {
        ApartmentId     = f.ApartmentId,
        Wifi            = f.Wifi,
        Parking         = f.Parking,
        ParkingFree     = f.ParkingFree,
        AirConditioning = f.AirConditioning,
        Heating         = f.Heating,
        Washer          = f.Washer,
        Dryer           = f.Dryer,
        Dishwasher      = f.Dishwasher,
        Refrigerator    = f.Refrigerator,
        Microwave       = f.Microwave,
        Oven            = f.Oven,
        Stove           = f.Stove,
        Kitchen         = f.Kitchen,
        Tv              = f.TV,
        Balcony         = f.Balcony,
        Terrace         = f.Terrace,
        Garden          = f.Garden,
        Pool            = f.Pool,
        Gym             = f.Gym,
        Elevator        = f.Elevator,
        PetsAllowed     = f.PetsAllowed,
        SmokingAllowed  = f.SmokingAllowed,
        SecurityCamera  = f.SecurityCamera,
        KeypadEntry     = f.KeypadEntry,
        Safe            = f.Safe,
    };
}
