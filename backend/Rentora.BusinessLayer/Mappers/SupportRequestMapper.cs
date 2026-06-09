namespace Rentora.BusinessLayer.Mappers;

using Rentora.Domain.Entities;
using Rentora.Domain.Models.SupportRequest;

public static class SupportRequestMapper
{
    public static SupportRequestDto ToDto(SupportRequest r) => new SupportRequestDto
    {
        Id        = r.Id,
        UserId    = r.UserId,
        Email     = r.Email,
        Subject   = r.Subject,
        Message   = r.Message,
        CreatedAt = r.CreatedAt,
        Status    = r.Status
    };
}
