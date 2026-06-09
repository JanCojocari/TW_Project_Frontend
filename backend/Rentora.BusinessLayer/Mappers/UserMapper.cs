namespace Rentora.BusinessLayer.Mappers;

using Rentora.Domain.Entities;
using Rentora.Domain.Models.User;

public static class UserMapper
{
    public static UserDto ToDto(User user) => new UserDto
    {
        Id             = user.Id,
        Name           = user.Name,
        Surname        = user.Surname,
        Email          = user.Email,
        Phone          = user.Phone,
        Birthday       = user.Birthday,
        Gender         = user.Gender,
        AccountBalance = user.AccountBalance,
        Role           = user.Role,
        AvatarUrl      = user.AvatarUrl
    };
}
