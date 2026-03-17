using System.ComponentModel.DataAnnotations;
using Rentora.Domain.Enums;

namespace Rentora.Domain.Entities;

public class SupportRequest
{
    [Key]
    public int Id { get; set; }

    public int? UserId { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string Subject { get; set; } = string.Empty;

    [Required]
    public string Message { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    //toate cererile incep cu statutul open automat
    public SupportStatus Status { get; set; } = SupportStatus.Open; 

    // Navigation
    public User? User { get; set; } // optional - userul poate fi null (anonim, neautentificat)
}