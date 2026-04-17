namespace Rentora.Domain.Enums;

public enum ApartmentStatus
{
    Pending,   // 0 — în așteptare, implicit la creare
    Approved,  // 1 — aprobat de admin
    Declined   // 2 — respins de admin
}
