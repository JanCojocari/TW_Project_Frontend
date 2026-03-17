using System.ComponentModel.DataAnnotations;

namespace Rentora.Domain.Entities;

public class Session
{
    [Key]
    public int Id { get; set; }

    public int UserId { get; set; }

    [Required]
    public string Token { get; set; } = string.Empty; //token JWT generat la login

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime ExpiresAt { get; set; } //variabila ce arata cand expira sesiunea

    // Navigation property
    public User User { get; set; } = null!;
}