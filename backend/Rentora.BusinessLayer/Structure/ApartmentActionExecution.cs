namespace Rentora.BusinessLayer.Structure;

using Rentora.BusinessLayer.Core;
using Rentora.BusinessLayer.Interfaces;
using Rentora.Domain.Models.Apartment;
using Rentora.Domain.Models.Responses;

public class ApartmentActionExecution : ApartmentActions, IApartmentAction
{
    public List<ApartmentDto> GetAll()
        => GetAllExecution();

    public ApartmentDto? GetById(int id)
        => GetByIdExecution(id);

    public List<ApartmentDto> GetByOwner(int ownerId)
        => GetByOwnerExecution(ownerId);

    public ActionResponse Create(int ownerId, ApartmentCreateDto data)
        => CreateExecution(ownerId, data);

    public ActionResponse Update(ApartmentUpdateDto data)
        => UpdateExecution(data);

    public ActionResponse Delete(int id)
        => DeleteExecution(id);

    public ActionResponse AssignRenter(int apartmentId, int renterId)
        => AssignRenterExecution(apartmentId, renterId);

    public ActionResponse RemoveRenter(int apartmentId)
        => RemoveRenterExecution(apartmentId);

    public List<ApartmentDto> GetPending()
        => GetPendingExecution();

    public ActionResponse Approve(int id)
        => ApproveExecution(id);

    public ActionResponse Decline(int id)
        => DeclineExecution(id);
}
