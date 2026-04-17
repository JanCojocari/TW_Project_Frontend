namespace Rentora.BusinessLayer;

using Microsoft.Extensions.Configuration;
using Rentora.BusinessLayer.Interfaces;
using Rentora.BusinessLayer.Structure;

public class BusinessLogic
{
    private readonly IConfiguration _config;

    public BusinessLogic(IConfiguration config)
    {
        _config = config;
    }

    public IUserAction UserAction() => new UserActionExecution(_config);
    public ISupportRequestAction SupportRequestAction() => new SupportRequestExecution();
    public IApartmentAction ApartmentAction() => new ApartmentActionExecution();
    public IReviewAction ReviewAction() => new ReviewActionExecution();
    public IRecentViewAction RecentViewAction() => new RecentViewActionExecution();
    public IPaymentAction PaymentAction() => new PaymentActionExecution();
}
