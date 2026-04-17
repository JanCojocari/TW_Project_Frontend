namespace Rentora.BusinessLayer.Core;

using Rentora.DataAccess;
using Rentora.Domain.Entities;
using Rentora.Domain.Models.Review;
using Rentora.Domain.Models.Responses;

public class ReviewActions
{
    protected ReviewActions() { }

    protected List<ReviewDto> GetByApartmentExecution(int apartmentId)
    {
        using var db = new AppDbContext();

        return db.Reviews
            .Where(r => r.ApartmentId == apartmentId)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => MapToDto(r))
            .ToList();
    }

    protected ReviewDto? GetByIdExecution(int id)
    {
        using var db = new AppDbContext();

        var review = db.Reviews.FirstOrDefault(r => r.Id == id);
        if (review == null) return null;

        return MapToDto(review);
    }

    protected ActionResponse CreateExecution(int userId, ReviewCreateDto data)
    {
        using var db = new AppDbContext();

        var apartmentExists = db.Apartments.Any(a => a.Id == data.ApartmentId);
        if (!apartmentExists)
            return new ActionResponse { IsSuccess = false, Message = "Apartment not found." };

        var userExists = db.Users.Any(u => u.Id == userId);
        if (!userExists)
            return new ActionResponse { IsSuccess = false, Message = "User not found." };

        var alreadyReviewed = db.Reviews.Any(r => r.ApartmentId == data.ApartmentId && r.UserId == userId);
        if (alreadyReviewed)
            return new ActionResponse { IsSuccess = false, Message = "You have already reviewed this apartment." };

        var review = new Review
        {
            ApartmentId = data.ApartmentId,
            UserId      = userId,
            Rating      = data.Rating,
            Comment     = data.Comment,
            CreatedAt   = DateTime.UtcNow
        };

        db.Reviews.Add(review);
        db.SaveChanges();

        return new ActionResponse { IsSuccess = true, Message = "Review submitted." };
    }

    protected ActionResponse AddOwnerResponseExecution(int reviewId, string ownerResponse)
    {
        using var db = new AppDbContext();

        var review = db.Reviews.FirstOrDefault(r => r.Id == reviewId);
        if (review == null)
            return new ActionResponse { IsSuccess = false, Message = "Review not found." };

        review.OwnerResponse = ownerResponse;
        db.Reviews.Update(review);
        db.SaveChanges();

        return new ActionResponse { IsSuccess = true, Message = "Owner response added." };
    }

    protected ActionResponse DeleteExecution(int id)
    {
        using var db = new AppDbContext();

        var review = db.Reviews.FirstOrDefault(r => r.Id == id);
        if (review == null)
            return new ActionResponse { IsSuccess = false, Message = "Review not found." };

        db.Reviews.Remove(review);
        db.SaveChanges();

        return new ActionResponse { IsSuccess = true, Message = "Review deleted." };
    }

    private static ReviewDto MapToDto(Review r) => new ReviewDto
    {
        Id            = r.Id,
        ApartmentId   = r.ApartmentId,
        UserId        = r.UserId ?? 0,
        Rating        = r.Rating,
        Comment       = r.Comment,
        OwnerResponse = r.OwnerResponse,
        CreatedAt     = r.CreatedAt
    };
}
