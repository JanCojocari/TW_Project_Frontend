namespace Rentora.BusinessLayer.Core;

using Rentora.DataAccess;
using Rentora.Domain.Entities;
using Rentora.Domain.Models.Review;
using Rentora.Domain.Models.Responses;
using Microsoft.EntityFrameworkCore;

public class ReviewActions
{
    protected ReviewActions() { }

    protected List<ReviewDto> GetAllExecution()
    {
        using var db = new AppDbContext();
        return db.Reviews
            .Include(r => r.User)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => MapToDto(r))
            .ToList();
    }

    protected List<ReviewDto> GetByApartmentExecution(int apartmentId)
    {
        using var db = new AppDbContext();
        return db.Reviews
            .Include(r => r.User)
            .Where(r => r.ApartmentId == apartmentId)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ReviewDto
            {
                Id            = r.Id,
                ApartmentId   = r.ApartmentId,
                UserId        = r.UserId ?? 0,
                UserName      = r.User != null ? r.User.Name : null,
                UserSurname   = r.User != null ? r.User.Surname : null,
                Rating        = r.Rating,
                Comment       = r.Comment,
                OwnerResponse = r.OwnerResponse,
                CreatedAt     = r.CreatedAt,
                StayStartDate = db.Payments
                    .Where(p => p.ApartmentId == apartmentId && p.RenterId == r.UserId)
                    .OrderByDescending(p => p.CreatedAt)
                    .Select(p => p.StartDate)
                    .FirstOrDefault(),
                StayEndDate = db.Payments
                    .Where(p => p.ApartmentId == apartmentId && p.RenterId == r.UserId)
                    .OrderByDescending(p => p.CreatedAt)
                    .Select(p => p.EndDate)
                    .FirstOrDefault(),
            })
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

        // validare ca userul a avut un stay platit
        var hasPayment = db.Payments.Any(p => p.ApartmentId == data.ApartmentId && p.RenterId == userId);
        if (!hasPayment)
            return new ActionResponse { IsSuccess = false, Message = "You must have completed a stay to leave a review." };

        var alreadyReviewed = db.Reviews.Any(r => r.ApartmentId == data.ApartmentId && r.UserId == userId);
        if (alreadyReviewed)
            return new ActionResponse { IsSuccess = false, Message = "You have already reviewed this apartment." };

        // validare rating
        if (data.Rating < 1 || data.Rating > 5)
            return new ActionResponse { IsSuccess = false, Message = "Rating must be between 1 and 5." };

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

    protected ActionResponse AddOwnerResponseExecution(int reviewId, int userId, string ownerResponse)
    {
        using var db = new AppDbContext();

        var review = db.Reviews
            .Include(r => r.Apartment)
            .FirstOrDefault(r => r.Id == reviewId);

        if (review == null)
            return new ActionResponse { IsSuccess = false, Message = "Review not found." };

        if (review.Apartment.OwnedId != userId)
            return new ActionResponse { IsSuccess = false, Message = "Only the apartment owner can respond." };

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
        UserName      = r.User?.Name,
        UserSurname   = r.User?.Surname,
        Rating        = r.Rating,
        Comment       = r.Comment,
        OwnerResponse = r.OwnerResponse,
        CreatedAt     = r.CreatedAt
    };
}
