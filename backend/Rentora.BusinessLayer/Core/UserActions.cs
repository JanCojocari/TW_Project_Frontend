using Rentora.BusinessLayer.Helpers;
using Rentora.Domain.Models.LoginResponse;

namespace Rentora.BusinessLayer.Core;

using Rentora.DataAccess;
using Rentora.Domain.Entities;
using Rentora.Domain.Models.User;
using Rentora.Domain.Models.Responses;

public class UserActions
{
    protected UserActions() { }

    protected ActionResponse RegisterExecution(UserRegisterDto data)
    {
        using var db = new AppDbContext();

        // verifica daca emailul exista deja
        var existing = db.Users.FirstOrDefault(u => u.Email == data.Email);
        if (existing != null)
            return new ActionResponse { IsSuccess = false, Message = "Email already in use." };

        var user = new User
        {
            Name = data.Name,
            Surname = data.Surname,
            Email = data.Email,
            PasswordHash = HashPassword(data.Password),
            Phone = data.Phone,
            Birthday = data.Birthday,
            Gender = data.Gender,
            Role = Rentora.Domain.Enums.Role.Renter // rol implicit la inregistrare
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
            return new ActionResponse 
            { 
                IsSuccess = false, 
                Message = "Invalid email or password." 
            };
        
        var jwtHelper = new JwtHelper();
        var token = jwtHelper.GenerateToken(user);

        return new AuthResponseDto()
        {
            User = MapToDto(user),
            AccessToken = token
        };
    }

    protected UserDto? GetByIdExecution(int id)
    {
        using var db = new AppDbContext();
        var user = db.Users.FirstOrDefault(u => u.Id == id);
        if (user == null) return null;
        return MapToDto(user);
    }

    protected List<UserDto> GetAllExecution()
    {
        using var db = new AppDbContext();
        return db.Users.Select(u => MapToDto(u)).ToList();
    }

    protected ActionResponse UpdateExecution(int id, UserUpdateDto data)
    {
        using var db = new AppDbContext();

        var user = db.Users.FirstOrDefault(u => u.Id == id);
        if (user == null)
            return new ActionResponse { IsSuccess = false, Message = "User not found." };

        user.Name = data.Name;
        user.Surname = data.Surname;
        user.Phone = data.Phone;
        user.Birthday = data.Birthday;
        user.Gender = data.Gender;

        db.Users.Update(user);
        db.SaveChanges();

        return new ActionResponse { IsSuccess = true, Message = "User updated successfully." };
    }

    protected ActionResponse DeleteExecution(int id)
    {
        using var db = new AppDbContext();

        var user = db.Users.FirstOrDefault(u => u.Id == id);
        if (user == null)
            return new ActionResponse { IsSuccess = false, Message = "User not found." };

        db.Users.Remove(user);
        db.SaveChanges();

        return new ActionResponse { IsSuccess = true, Message = "User deleted successfully." };
    }

    // helper privat -- mapare Entity -> DTO
    private static UserDto MapToDto(User user) => new UserDto
    {
        Id = user.Id,
        Name = user.Name,
        Surname = user.Surname,
        Email = user.Email,
        Phone = user.Phone,
        Birthday = user.Birthday,
        Gender = user.Gender,
        AccountBalance = user.AccountBalance,
        Role = user.Role
    };

    // helper privat -- hash simplu, de inlocuit cu BCrypt ulterior
    private static string HashPassword(string password) =>
        Convert.ToBase64String(
            System.Security.Cryptography.SHA256.HashData(
                System.Text.Encoding.UTF8.GetBytes(password)));
}