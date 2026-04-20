// Rentora.BusinessLayer/Structure/UserActionExecution.cs
namespace Rentora.BusinessLayer.Structure;

using Microsoft.Extensions.Configuration;
using Rentora.BusinessLayer.Core;
using Rentora.BusinessLayer.Interfaces;
using Rentora.Domain.Models.User;
using Rentora.Domain.Models.Responses;

public class UserActionExecution : UserActions, IUserAction
{
    public UserActionExecution(IConfiguration config) : base(config) { }

    public ActionResponse Register(UserRegisterDto data)
        => RegisterExecution(data);

    public object Login(UserLoginDto data)
        => LoginExecution(data);

    public UserDto? GetById(int id)
        => GetByIdExecution(id);

    public List<UserDto> GetAll()
        => GetAllExecution();

    public ActionResponse Update(int id, UserUpdateDto data)
        => UpdateExecution(id, data);

    public ActionResponse ChangePassword(int id, UserChangePasswordDto data)
        => ChangePasswordExecution(id, data);

    public ActionResponse UpdateAvatar(int id, string avatarUrl)
        => UpdateAvatarExecution(id, avatarUrl);

    public ActionResponse Delete(int id)
        => DeleteExecution(id);

    public ActionResponse UpdateRole(int id, int role)
        => UpdateRoleExecution(id, role);
}