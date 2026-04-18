namespace Rentora.BusinessLayer.Structure;

using Rentora.BusinessLayer.Core;
using Rentora.BusinessLayer.Interfaces;
using Rentora.Domain.Models.Favorite;
using Rentora.Domain.Models.Responses;

public class FavoriteActionExecution : FavoriteActions, IFavoriteAction
{
    public List<FavoriteDto> GetByUser(int userId)
        => GetByUserExecution(userId);

    public ActionResponse Add(int userId, int apartmentId)
        => AddExecution(userId, apartmentId);

    public ActionResponse Remove(int userId, int apartmentId)
        => RemoveExecution(userId, apartmentId);
}