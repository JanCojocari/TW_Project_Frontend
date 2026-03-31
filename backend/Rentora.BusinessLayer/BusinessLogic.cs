namespace Rentora.BusinessLayer;

using Rentora.BusinessLayer.Interfaces;
using Rentora.BusinessLayer.Structure;

public class BusinessLogic
{
    public BusinessLogic() { }

    public IUserAction UserAction() => new UserActionExecution();
}
