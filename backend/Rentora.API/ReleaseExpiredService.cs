namespace Rentora.API;

using Rentora.BusinessLayer;

// ruleaza in background la fiecare ora si elibereaza apartamentele cu EndDate expirat
public class ReleaseExpiredService : BackgroundService
{
    private readonly IServiceProvider _services;
    private readonly ILogger<ReleaseExpiredService> _logger;
    private readonly TimeSpan _interval = TimeSpan.FromMinutes(1);

    public ReleaseExpiredService(IServiceProvider services, ILogger<ReleaseExpiredService> logger)
    {
        _services = services;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("ReleaseExpiredService pornit.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _services.CreateScope();
                var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();
                var bl = new BusinessLogic(config);
                var result = bl.PaymentAction().ReleaseExpired();
                _logger.LogInformation("ReleaseExpired: {msg}", result.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare in ReleaseExpiredService.");
            }

            await Task.Delay(_interval, stoppingToken);
        }
    }
}