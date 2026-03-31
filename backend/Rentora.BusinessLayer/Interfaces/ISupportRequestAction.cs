using Rentora.Domain.Models.Responses;
using Rentora.Domain.Models.SupportRequest;

namespace Rentora.BusinessLayer.Interfaces
{
    public interface ISupportRequestAction
    {
        List<SupportRequestDto> GetAll();
        SupportRequestDto? GetById(int id);
        ActionResponse Create(int? userId, SupportRequestCreateDto data);
        ActionResponse UpdateStatus(int id, string status);
    }
}
