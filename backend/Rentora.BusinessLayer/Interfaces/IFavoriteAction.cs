using Rentora.Domain.Models.Favorite;
using Rentora.Domain.Models.Responses;

namespace Rentora.BusinessLayer.Interfaces
{
    public interface IFavoriteAction
    {
        List<FavoriteDto> GetByUser(int userId);
        ActionResponse Add(int userId, int apartmentId);
        ActionResponse Remove(int userId, int apartmentId);
    }
}
