namespace Rentora.BusinessLayer.Structure;

using Rentora.BusinessLayer.Core;
using Rentora.BusinessLayer.Interfaces;
using Rentora.Domain.Models.Payment;
using Rentora.Domain.Models.Responses;

public class PaymentActionExecution : PaymentActions, IPaymentAction
{
    public List<PaymentDto> GetAll()
        => GetAllExecution();

    public List<PaymentDto> GetByUser(int userId)
        => GetByUserExecution(userId);

    public List<PaymentDto> GetByOwner(int ownerId)
        => GetByOwnerExecution(ownerId);

    public List<PaymentDto> GetByRenter(int renterId)
        => GetByRenterExecution(renterId);

    public List<PaymentDto> GetByApartment(int apartmentId)
        => GetByApartmentExecution(apartmentId);

    public PaymentDto? GetById(int id)
        => GetByIdExecution(id);

    public ActionResponse Create(int renterId, PaymentCreateDto data)
        => CreateExecution(renterId, data);

    public List<BookedPeriodDto> GetBookedPeriods(int apartmentId)
        => GetBookedPeriodsExecution(apartmentId);
}