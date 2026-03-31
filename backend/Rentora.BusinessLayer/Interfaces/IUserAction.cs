using Rentora.Domain.Models.Responses;
using Rentora.Domain.Models.User;

namespace Rentora.BusinessLayer.Interfaces
{
    public interface IUserAction
    {
        ActionResponse Register(UserRegisterDto data);
        object Login(UserLoginDto data);
        UserDto? GetById(int id);
        ActionResponse Update(int id, UserUpdateDto data);
        ActionResponse Delete(int id);
    }
}
