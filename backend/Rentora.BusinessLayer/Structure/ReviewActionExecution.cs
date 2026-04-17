namespace Rentora.BusinessLayer.Structure;

using Rentora.BusinessLayer.Core;
using Rentora.BusinessLayer.Interfaces;
using Rentora.Domain.Models.Review;
using Rentora.Domain.Models.Responses;

public class ReviewActionExecution : ReviewActions, IReviewAction
{
    public List<ReviewDto> GetAll()
        => GetAllExecution();

    public List<ReviewDto> GetByApartment(int apartmentId)
        => GetByApartmentExecution(apartmentId);

    public ReviewDto? GetById(int id)
        => GetByIdExecution(id);

    public ActionResponse Create(int userId, ReviewCreateDto data)
        => CreateExecution(userId, data);

    public ActionResponse AddOwnerResponse(int reviewId, string ownerResponse)
        => AddOwnerResponseExecution(reviewId, ownerResponse);

    public ActionResponse Delete(int id)
        => DeleteExecution(id);
}
