namespace Rentora.BusinessLayer.Core;

using Rentora.DataAccess;
using Rentora.Domain.Entities;
using Rentora.Domain.Models.RecentView;
using Rentora.Domain.Models.Responses;

public class RecentViewActions
{
    protected RecentViewActions() { }

    protected List<RecentViewDto> GetByUserExecution(int userId)
    {
        using var db = new AppDbContext();

        return db.RecentViews
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.ViewedAt)
            .Take(20)
            .Select(r => MapToDto(r))
            .ToList();
    }

    protected ActionResponse AddExecution(int userId, int apartmentId)
    {
        using var db = new AppDbContext();

        var apartmentExists = db.Apartments.Any(a => a.Id == apartmentId);
        if (!apartmentExists)
            return new ActionResponse { IsSuccess = false, Message = "Apartment not found." };

        var userExists = db.Users.Any(u => u.Id == userId);
        if (!userExists)
            return new ActionResponse { IsSuccess = false, Message = "User not found." };

        var cutoff = DateTime.UtcNow.AddHours(-24);
        var alreadyViewed = db.RecentViews.Any(r =>
            r.UserId == userId &&
            r.ApartmentId == apartmentId &&
            r.ViewedAt >= cutoff);

        if (!alreadyViewed)
        {
            var entry = new RecentView
            {
                UserId      = userId,
                ApartmentId = apartmentId,
                ViewedAt    = DateTime.UtcNow
            };
            db.RecentViews.Add(entry);
            db.SaveChanges();
        }

        return new ActionResponse { IsSuccess = true, Message = "Added to recent views." };
    }

    protected ActionResponse ClearAllExecution(int userId)
    {
        using var db = new AppDbContext();

        var entries = db.RecentViews.Where(r => r.UserId == userId).ToList();
        if (entries.Count == 0)
            return new ActionResponse { IsSuccess = true, Message = "Nothing to clear." };

        db.RecentViews.RemoveRange(entries);
        db.SaveChanges();

        return new ActionResponse { IsSuccess = true, Message = "Recent views cleared." };
    }

    private static RecentViewDto MapToDto(RecentView r) => new RecentViewDto
    {
        UserId      = r.UserId,
        ApartmentId = r.ApartmentId,
        ViewedAt    = r.ViewedAt
    };
}