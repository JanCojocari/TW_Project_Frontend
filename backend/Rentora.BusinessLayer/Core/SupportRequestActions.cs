namespace Rentora.BusinessLayer.Core;

using Rentora.DataAccess;
using Rentora.Domain.Entities;
using Rentora.Domain.Enums;
using Rentora.Domain.Models.SupportRequest;
using Rentora.Domain.Models.Responses;

public class SupportRequestActions
{
    protected SupportRequestActions() { }

    protected ActionResponse CreateExecution(SupportRequestCreateDto data)
    {
        using var db = new AppDbContext();

        var request = new SupportRequest
        {
            Email = data.Email,
            Subject = data.Subject,
            Message = data.Message,
            Status = SupportStatus.Open,
            CreatedAt = DateTime.UtcNow
        };

        db.SupportRequests.Add(request);
        db.SaveChanges();

        return new ActionResponse { IsSuccess = true, Message = "Support request submitted." };
    }

    protected List<SupportRequestDto> GetAllExecution()
    {
        using var db = new AppDbContext();

        return db.SupportRequests
            .Select(r => MapToDto(r))
            .ToList();
    }

    protected SupportRequestDto? GetByIdExecution(int id)
    {
        using var db = new AppDbContext();

        var request = db.SupportRequests.FirstOrDefault(r => r.Id == id);
        if (request == null) return null;

        return MapToDto(request);
    }

    protected ActionResponse DeleteExecution(int id)
    {
        using var db = new AppDbContext();

        var request = db.SupportRequests.FirstOrDefault(r => r.Id == id);
        if (request == null)
            return new ActionResponse { IsSuccess = false, Message = "Support request not found." };

        db.SupportRequests.Remove(request);
        db.SaveChanges();

        return new ActionResponse { IsSuccess = true, Message = "Support request deleted." };
    }

    protected ActionResponse UpdateStatusExecution(int id, string status)
    {
        using var db = new AppDbContext();

        var request = db.SupportRequests.FirstOrDefault(r => r.Id == id);
        if (request == null)
            return new ActionResponse { IsSuccess = false, Message = "Support request not found." };

        // parseaza string-ul in enum
        if (!Enum.TryParse<SupportStatus>(status, ignoreCase: true, out var newStatus))
            return new ActionResponse { IsSuccess = false, Message = "Invalid status. Use: Open, InProgress, Resolved, Closed." };

        request.Status = newStatus;
        db.SupportRequests.Update(request);
        db.SaveChanges();

        return new ActionResponse { IsSuccess = true, Message = $"Status updated to {newStatus}." };
    }

    // helper privat
    private static SupportRequestDto MapToDto(SupportRequest r) => new SupportRequestDto
    {
        Id = r.Id,
        UserId = r.UserId,
        Email = r.Email,
        Subject = r.Subject,
        Message = r.Message,
        CreatedAt = r.CreatedAt,
        Status = r.Status
    };
}