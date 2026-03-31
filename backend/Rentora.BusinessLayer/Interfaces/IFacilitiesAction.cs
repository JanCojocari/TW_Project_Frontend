using Rentora.Domain.Models.Facilities;
using Rentora.Domain.Models.Responses;

namespace Rentora.BusinessLayer.Interfaces
{
    public interface IFacilitiesAction
    {
        FacilitiesDto? GetByApartment(int apartmentId);
        ActionResponse Update(FacilitiesDto data);
    }
}
