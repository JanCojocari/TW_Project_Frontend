// Rentora.BusinessLayer/Core/UserActions.cs
using Rentora.BusinessLayer.Helpers;
using Rentora.Domain.Models.LoginResponse;
using Microsoft.Extensions.Configuration;

namespace Rentora.BusinessLayer.Core;

using Rentora.DataAccess;
using Rentora.Domain.Entities;
using Rentora.Domain.Models.User;
using Rentora.Domain.Models.Responses;

public class UserActions
{
    private readonly IConfiguration _config;

    protected UserActions(IConfiguration config)
    {
        _config = config;
    }

    protected ActionResponse RegisterExecution(UserRegisterDto data)
    {
        using var db = new AppDbContext();

        var existing = db.Users.FirstOrDefault(u => u.Email == data.Email);
        if (existing != null)
            return new ActionResponse { IsSuccess = false, Message = "Email already in use." };

        var user = new User
        {
            Name         = data.Name,
            Surname      = data.Surname,
            Email        = data.Email,
            PasswordHash = HashPassword(data.Password),
            Phone        = data.Phone,
            Birthday     = data.Birthday,
            Gender       = data.Gender,
            Role         = Rentora.Domain.Enums.Role.Renter
        };

        db.Users.Add(user);
        db.SaveChanges();

        return new ActionResponse { IsSuccess = true, Message = "Registration successful." };
    }

    protected object LoginExecution(UserLoginDto data)
    {
        using var db = new AppDbContext();

        var user = db.Users.FirstOrDefault(u =>
            u.Email == data.Email &&
            u.PasswordHash == HashPassword(data.Password));

        if (user == null)
            return new ActionResponse { IsSuccess = false, Message = "Invalid email or password." };

        var jwtHelper = new JwtHelper(_config);
        var token     = jwtHelper.GenerateToken(user);

        return new AuthResponseDto
        {
            User        = MapToDto(user),
            AccessToken = token
        };
    }

    protected UserDto? GetByIdExecution(int id)
    {
        using var db = new AppDbContext();
        var user = db.Users.FirstOrDefault(u => u.Id == id);
        return user == null ? null : MapToDto(user);
    }

    protected List<UserDto> GetAllExecution()
    {
        using var db = new AppDbContext();
        return db.Users.Select(u => MapToDto(u)).ToList();
    }

    // Patch-style: actualizeaza DOAR campurile non-null din DTO.
    // ProfileSection trimite { Name, Surname, Birthday, Gender }  → Phone/Email raman neschimbate.
    // ContactSection trimite { Phone, Email }                     → Name/Surname/etc raman neschimbate.
    protected ActionResponse UpdateExecution(int id, UserUpdateDto data)
    {
        using var db = new AppDbContext();

        var user = db.Users.FirstOrDefault(u => u.Id == id);
        if (user == null)
            return new ActionResponse { IsSuccess = false, Message = "User not found." };

        if (data.Name     != null) user.Name     = data.Name;
        if (data.Surname  != null) user.Surname  = data.Surname;
        if (data.Phone    != null) user.Phone    = data.Phone;
        if (data.Birthday != null) user.Birthday = data.Birthday.Value;
        if (data.Gender   != null) user.Gender   = data.Gender;

        if (data.Email != null)
        {
            if (!string.IsNullOrWhiteSpace(data.Email))
            {
                var emailTaken = db.Users.Any(u => u.Email == data.Email && u.Id != id);
                if (emailTaken)
                    return new ActionResponse { IsSuccess = false, Message = "Email already in use." };
            }
            user.Email = data.Email;
        }

        db.SaveChanges();

        return new ActionResponse { IsSuccess = true, Message = "User updated successfully." };
    }

    protected ActionResponse ChangePasswordExecution(int id, UserChangePasswordDto data)
    {
        using var db = new AppDbContext();

        var user = db.Users.FirstOrDefault(u => u.Id == id);
        if (user == null)
            return new ActionResponse { IsSuccess = false, Message = "User not found." };

        if (user.PasswordHash != HashPassword(data.OldPassword))
            return new ActionResponse { IsSuccess = false, Message = "Current password is incorrect." };

        if (data.NewPassword.Length < 6)
            return new ActionResponse { IsSuccess = false, Message = "New password must be at least 6 characters." };

        user.PasswordHash = HashPassword(data.NewPassword);
        db.SaveChanges();

        return new ActionResponse { IsSuccess = true, Message = "Password changed successfully." };
    }

    protected ActionResponse UpdateAvatarExecution(int id, string avatarUrl)
    {
        using var db = new AppDbContext();

        var user = db.Users.FirstOrDefault(u => u.Id == id);
        if (user == null)
            return new ActionResponse { IsSuccess = false, Message = "User not found." };

        user.AvatarUrl = avatarUrl;
        db.SaveChanges();

        return new ActionResponse { IsSuccess = true, Message = "Avatar updated successfully." };
    }

    protected ActionResponse DeleteExecution(int id)
    {
        using var db = new AppDbContext();

        var user = db.Users.FirstOrDefault(u => u.Id == id);
        if (user == null)
            return new ActionResponse { IsSuccess = false, Message = "User not found." };

        var paymentsAsOwner = db.Payments.Where(p => p.OwnerId == id).ToList();
        foreach (var p in paymentsAsOwner) p.OwnerId = null;

        var paymentsAsRenter = db.Payments.Where(p => p.RenterId == id).ToList();
        foreach (var p in paymentsAsRenter) p.RenterId = null;

        db.SaveChanges();
        db.Users.Remove(user);
        db.SaveChanges();

        return new ActionResponse { IsSuccess = true, Message = "User deleted successfully." };
    }

    protected ActionResponse UpdateRoleExecution(int id, int role)
    {
        using var db = new AppDbContext();

        var user = db.Users.FirstOrDefault(u => u.Id == id);
        if (user == null)
            return new ActionResponse { IsSuccess = false, Message = "User not found." };

        if (!Enum.IsDefined(typeof(Rentora.Domain.Enums.Role), role))
            return new ActionResponse { IsSuccess = false, Message = "Invalid role value." };

        user.Role = (Rentora.Domain.Enums.Role)role;
        db.SaveChanges();

        return new ActionResponse { IsSuccess = true, Message = $"Role updated to {(Rentora.Domain.Enums.Role)role}." };
    }

    private static UserDto MapToDto(User user) => new UserDto
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

    private static string HashPassword(string password) =>
        Convert.ToBase64String(
            System.Security.Cryptography.SHA256.HashData(
                System.Text.Encoding.UTF8.GetBytes(password)));
}