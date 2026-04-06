namespace Rentora.BusinessLayer.Structure;

using Rentora.BusinessLayer.Core;
using Rentora.BusinessLayer.Interfaces;
using Rentora.Domain.Models.RecentView;
using Rentora.Domain.Models.Responses;

public class RecentViewActionExecution : RecentViewActions, IRecentViewAction
{
    public List<RecentViewDto> GetByUser(int userId)
        => GetByUserExecution(userId);

    public ActionResponse Add(int userId, int apartmentId)
        => AddExecution(userId, apartmentId);

    public ActionResponse ClearAll(int userId)
        => ClearAllExecution(userId);
}
