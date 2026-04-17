using Rentora.Domain.Models.Apartment;
using Rentora.Domain.Models.Responses;

namespace Rentora.BusinessLayer.Interfaces
{
    public interface IApartmentAction
    {
        List<ApartmentDto> GetAll();
        ApartmentDto? GetById(int id);
        List<ApartmentDto> GetByOwner(int ownerId);
        ActionResponse Create(int ownerId, ApartmentCreateDto data);
        ActionResponse Update(ApartmentUpdateDto data);
        ActionResponse Delete(int id);
        ActionResponse AssignRenter(int apartmentId, int renterId);
        ActionResponse RemoveRenter(int apartmentId);
        List<ApartmentDto> GetPending();
        ActionResponse Approve(int id);
        ActionResponse Decline(int id);
    }
}
