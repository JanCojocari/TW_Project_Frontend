namespace Rentora.BusinessLayer;

using Rentora.BusinessLayer.Interfaces;
using Rentora.BusinessLayer.Structure;

public class BusinessLogic
{
    public BusinessLogic() { }

    public IUserAction UserAction() => new UserActionExecution();
    public ISupportRequestAction SupportRequestAction() => new SupportRequestExecution();
    public IApartmentAction ApartmentAction() => new ApartmentActionExecution();
    public IReviewAction ReviewAction() => new ReviewActionExecution();
    public IRecentViewAction RecentViewAction() => new RecentViewActionExecution();
}
