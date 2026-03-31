namespace Rentora.BusinessLayer.Structure;

using Rentora.BusinessLayer.Core;
using Rentora.BusinessLayer.Interfaces;
using Rentora.Domain.Models.User;
using Rentora.Domain.Models.Responses;

public class UserActionExecution : UserActions, IUserAction
{
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

    public ActionResponse Delete(int id)
        => DeleteExecution(id);
}