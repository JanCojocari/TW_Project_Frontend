namespace Rentora.Domain.Models.Responses;

public class ActionResponse
{
    public bool IsSuccess { get; set; }
    public string? Message { get; set; }
    public int? Id { get; set; }
}