namespace Rentora.BusinessLayer.Mappers;

using Rentora.Domain.Entities;
using Rentora.Domain.Models.Review;

public static class ReviewMapper
{
    public static ReviewDto ToDto(Review r) => new ReviewDto
    {
        Id            = r.Id,
        ApartmentId   = r.ApartmentId,
        UserId        = r.UserId ?? 0,
        UserName      = r.User?.Name,
        UserSurname   = r.User?.Surname,
        UserAvatarUrl = r.User?.AvatarUrl,
        Rating        = r.Rating,
        Comment       = r.Comment,
        OwnerResponse = r.OwnerResponse,
        CreatedAt     = r.CreatedAt
    };
}
