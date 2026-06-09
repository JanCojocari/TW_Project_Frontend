namespace Rentora.BusinessLayer.Mappers;

using Rentora.Domain.Entities;
using Rentora.Domain.Models.RecentView;

public static class RecentViewMapper
{
    public static RecentViewDto ToDto(RecentView r) => new RecentViewDto
    {
        UserId      = r.UserId,
        ApartmentId = r.ApartmentId,
        ViewedAt    = r.ViewedAt
    };
}
