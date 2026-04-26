using Rentora.Domain.Models.Payment;
using Rentora.Domain.Models.Responses;

namespace Rentora.BusinessLayer.Interfaces
{
    public interface IPaymentAction
    {
        List<PaymentDto> GetAll();
        List<PaymentDto> GetByUser(int userId);
        List<PaymentDto> GetByOwner(int ownerId);
        List<PaymentDto> GetByRenter(int renterId);
        List<PaymentDto> GetByApartment(int apartmentId);
        PaymentDto? GetById(int id);
        ActionResponse Create(int renterId, PaymentCreateDto data);
        List<BookedPeriodDto> GetBookedPeriods(int apartmentId);
    }
}