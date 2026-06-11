// Rentora.BusinessLayer/Core/UserActions.cs
using Rentora.BusinessLayer.Helpers;
using Rentora.Domain.Models.LoginResponse;
using Microsoft.Extensions.Configuration;

namespace Rentora.BusinessLayer.Core;

using Rentora.DataAccess;
using Rentora.Domain.Entities;
using Rentora.Domain.Models.User;
using Rentora.BusinessLayer.Mappers;
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

        // Validare Name
        if (string.IsNullOrWhiteSpace(data.Name) || data.Name.Trim().Length < 2)
            return new ActionResponse { IsSuccess = false, Message = "Numele trebuie să conțină cel puțin 2 caractere." };
        if (!System.Text.RegularExpressions.Regex.IsMatch(data.Name.Trim(), @"^[\p{L}\s\-']+$"))
            return new ActionResponse { IsSuccess = false, Message = "Numele poate conține doar litere." };

        // Validare Surname
        if (string.IsNullOrWhiteSpace(data.Surname) || data.Surname.Trim().Length < 2)
            return new ActionResponse { IsSuccess = false, Message = "Prenumele trebuie să conțină cel puțin 2 caractere." };
        if (!System.Text.RegularExpressions.Regex.IsMatch(data.Surname.Trim(), @"^[\p{L}\s\-']+$"))
            return new ActionResponse { IsSuccess = false, Message = "Prenumele poate conține doar litere." };

        // Validare Email
        if (string.IsNullOrWhiteSpace(data.Email) ||
            !System.Text.RegularExpressions.Regex.IsMatch(data.Email.Trim(), @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
            return new ActionResponse { IsSuccess = false, Message = "Adresa de email nu este validă." };

        // Unicitate Email
        var existing = db.Users.FirstOrDefault(u => u.Email == data.Email.Trim());
        if (existing != null)
            return new ActionResponse { IsSuccess = false, Message = "Această adresă de email este deja folosită." };

        // Validare Password
        if (string.IsNullOrWhiteSpace(data.Password) || data.Password.Length < 8)
            return new ActionResponse { IsSuccess = false, Message = "Parola trebuie să conțină cel puțin 8 caractere." };
        if (!data.Password.Any(char.IsDigit))
            return new ActionResponse { IsSuccess = false, Message = "Parola trebuie să conțină cel puțin o cifră." };

        // Validare Phone (scoatem toate non-cifrele si verificam lungimea)
        var phoneDigits = System.Text.RegularExpressions.Regex.Replace(data.Phone ?? "", @"\D", "");
        if (phoneDigits.Length < 7 || phoneDigits.Length > 15)
            return new ActionResponse { IsSuccess = false, Message = "Numărul de telefon trebuie să conțină între 7 și 15 cifre." };

        // Validare Birthday (varsta minima 18 ani)
        if (data.Birthday == default)
            return new ActionResponse { IsSuccess = false, Message = "Data nașterii este obligatorie." };
        var today = DateTime.Today;
        var age = today.Year - data.Birthday.Year;
        if (data.Birthday.Date > today.AddYears(-age)) age--;
        if (age < 18)
            return new ActionResponse { IsSuccess = false, Message = "Trebuie să ai cel puțin 18 ani pentru a te înregistra." };

        // Validare Gender
        var validGenders = new[] { "male", "female", "other" };
        if (string.IsNullOrWhiteSpace(data.Gender) || !validGenders.Contains(data.Gender.ToLower()))
            return new ActionResponse { IsSuccess = false, Message = "Genul selectat nu este valid." };

        var user = new User
        {
            Name         = data.Name.Trim(),
            Surname      = data.Surname.Trim(),
            Email        = data.Email.Trim(),
            PasswordHash = HashPassword(data.Password),
            Phone        = data.Phone,
            Birthday     = data.Birthday,
            Gender       = data.Gender,
            Role = data.Role?.ToLower() == "owner"
                ? Rentora.Domain.Enums.Role.Owner
                : Rentora.Domain.Enums.Role.Renter
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
            User        = UserMapper.ToDto(user),
            AccessToken = token
        };
    }

    protected UserDto? GetByIdExecution(int id)
    {
        using var db = new AppDbContext();
        var user = db.Users.FirstOrDefault(u => u.Id == id);
        return user == null ? null : UserMapper.ToDto(user);
    }

    protected List<UserDto> GetAllExecution()
    {
        using var db = new AppDbContext();
        return db.Users.Select(u => UserMapper.ToDto(u)).ToList();
    }
    
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

    private static string HashPassword(string password) =>
        Convert.ToBase64String(
            System.Security.Cryptography.SHA256.HashData(
                System.Text.Encoding.UTF8.GetBytes(password)));
}