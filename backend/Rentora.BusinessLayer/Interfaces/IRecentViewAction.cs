using Rentora.Domain.Models.RecentView;
using Rentora.Domain.Models.Responses;

namespace Rentora.BusinessLayer.Interfaces
{
    public interface IRecentViewAction
    {
        List<RecentViewDto> GetByUser(int userId);
        ActionResponse Add(int userId, int apartmentId);
        ActionResponse ClearAll(int userId);
    }
}
