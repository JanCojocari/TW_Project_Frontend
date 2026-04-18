namespace Rentora.BusinessLayer.Core;

using Rentora.DataAccess;
using Rentora.Domain.Entities;
using Rentora.Domain.Models.Favorite;
using Rentora.Domain.Models.Responses;

public class FavoriteActions
{
    protected FavoriteActions() { }

    protected List<FavoriteDto> GetByUserExecution(int userId)
    {
        using var db = new AppDbContext();
        return db.Favorites
            .Where(f => f.UserId == userId)
            .Select(f => new FavoriteDto
            {
                UserId      = f.UserId,
                ApartmentId = f.ApartmentId
            })
            .ToList();
    }

    protected ActionResponse AddExecution(int userId, int apartmentId)
    {
        using var db = new AppDbContext();

        var userExists = db.Users.Any(u => u.Id == userId);
        if (!userExists)
            return new ActionResponse { IsSuccess = false, Message = "User not found." };

        var apartmentExists = db.Apartments.Any(a => a.Id == apartmentId);
        if (!apartmentExists)
            return new ActionResponse { IsSuccess = false, Message = "Apartment not found." };

        var alreadyFavorited = db.Favorites.Any(f => f.UserId == userId && f.ApartmentId == apartmentId);
        if (alreadyFavorited)
            return new ActionResponse { IsSuccess = false, Message = "Already in favorites." };

        db.Favorites.Add(new Favorite { UserId = userId, ApartmentId = apartmentId });
        db.SaveChanges();

        return new ActionResponse { IsSuccess = true, Message = "Added to favorites." };
    }

    protected ActionResponse RemoveExecution(int userId, int apartmentId)
    {
        using var db = new AppDbContext();

        var favorite = db.Favorites.FirstOrDefault(f => f.UserId == userId && f.ApartmentId == apartmentId);
        if (favorite == null)
            return new ActionResponse { IsSuccess = false, Message = "Favorite not found." };

        db.Favorites.Remove(favorite);
        db.SaveChanges();

        return new ActionResponse { IsSuccess = true, Message = "Removed from favorites." };
    }
}