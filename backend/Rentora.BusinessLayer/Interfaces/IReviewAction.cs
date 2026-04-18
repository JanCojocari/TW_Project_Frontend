using Rentora.Domain.Models.Responses;
using Rentora.Domain.Models.Review;

namespace Rentora.BusinessLayer.Interfaces
{
    public interface IReviewAction
    {
        List<ReviewDto> GetAll();
        List<ReviewDto> GetByApartment(int apartmentId);
        ReviewDto? GetById(int id);
        ActionResponse Create(int userId, ReviewCreateDto data);
        ActionResponse AddOwnerResponse(int reviewId, int userId, string ownerResponse);
        ActionResponse Delete(int id);
    }
}
