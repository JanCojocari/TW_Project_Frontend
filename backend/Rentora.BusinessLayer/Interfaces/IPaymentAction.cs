using Rentora.Domain.Models.Payment;
using Rentora.Domain.Models.Responses;

namespace Rentora.BusinessLayer.Interfaces
{
    public interface IPaymentAction
    {
        List<PaymentDto> GetByUser(int userId);
        List<PaymentDto> GetByApartment(int apartmentId);
        PaymentDto? GetById(int id);
        ActionResponse Create(int renterId, PaymentCreateDto data);
    }
}
