namespace Rentora.DataAccess;

using Microsoft.EntityFrameworkCore;
using Rentora.Domain.Entities;

public class AppDbContext : DbContext
{
    public AppDbContext() { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Apartment> Apartments => Set<Apartment>();
    public DbSet<Facilities> Facilities => Set<Facilities>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Favorite> Favorites => Set<Favorite>();
    public DbSet<RecentView> RecentViews => Set<RecentView>();
    public DbSet<SupportRequest> SupportRequests => Set<SupportRequest>();
    public DbSet<Session> Sessions => Set<Session>();

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseSqlServer(
                DbSession.ConnectionString ?? 
                "Server=localhost;Database=RentoraDB;Trusted_Connection=True;TrustServerCertificate=True"
            );
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // User -> OwnedApartments (one-to-many)
        modelBuilder.Entity<Apartment>()
            .HasOne(a => a.Owner)
            .WithMany(u => u.OwnedApartments)
            .HasForeignKey(a => a.OwnedId)
            .OnDelete(DeleteBehavior.Restrict);

        // User -> RentedApartment (optional)
        modelBuilder.Entity<Apartment>()
            .HasOne(a => a.Renter)
            .WithMany()
            .HasForeignKey(a => a.RenterId)
            .OnDelete(DeleteBehavior.SetNull);

        // Apartment -> Facilities (one-to-one)
        modelBuilder.Entity<Facilities>()
            .HasOne(f => f.Apartment)
            .WithOne(a => a.Facilities)
            .HasForeignKey<Facilities>(f => f.ApartmentId)
            .OnDelete(DeleteBehavior.Cascade);

        // Apartment -> Reviews
        modelBuilder.Entity<Review>()
            .HasOne(r => r.Apartment)
            .WithMany(a => a.Reviews)
            .HasForeignKey(r => r.ApartmentId)
            .OnDelete(DeleteBehavior.Cascade);

        // User -> Reviews
        modelBuilder.Entity<Review>()
            .HasOne(r => r.User)
            .WithMany(u => u.Reviews)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        // Favorite (cheie compusa)
        modelBuilder.Entity<Favorite>()
            .HasKey(f => new { f.UserId, f.ApartmentId });

        // Favorite -> User (Cascade - favoritele se sterg odata cu userul)
        modelBuilder.Entity<Favorite>()
            .HasOne(f => f.User)
            .WithMany(u => u.Favorites)
            .HasForeignKey(f => f.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        
        // Favorite -> Apartment (Cascade - favoritele se sterg odata cu apartmentul)
        modelBuilder.Entity<Favorite>()
            .HasOne(f => f.Apartment)
            .WithMany(a => a.Favorites)
            .HasForeignKey(f => f.ApartmentId)
            .OnDelete(DeleteBehavior.Cascade);

        // RecentView -> User (Cascade - recentviews se sterg odata cu userul)
        modelBuilder.Entity<RecentView>()
            .HasOne(r => r.User)
            .WithMany(u => u.RecentViews)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // RecentView -> Apartment (Cascade - recentviews se sterg odata cu apartmentul)
        modelBuilder.Entity<RecentView>()
            .HasOne(r => r.Apartment)
            .WithMany()
            .HasForeignKey(r => r.ApartmentId)
            .OnDelete(DeleteBehavior.Cascade);

        // Payment -> Owner (SetNull - plata ramane daca ownerul e sters)
        modelBuilder.Entity<Payment>()
            .HasOne(p => p.Owner)
            .WithMany()
            .HasForeignKey(p => p.OwnerId)
            .OnDelete(DeleteBehavior.NoAction);

        // Payment -> Renter (SetNull - plata ramane daca rentearul e sters)
        modelBuilder.Entity<Payment>()
            .HasOne(p => p.Renter)
            .WithMany()
            .HasForeignKey(p => p.RenterId)
            .OnDelete(DeleteBehavior.NoAction);
        
        // Payment -> Apartment (SetNull - plata ramane daca apartamentul e sters)
        modelBuilder.Entity<Payment>()
            .HasOne(p => p.Apartment)
            .WithMany()
            .HasForeignKey(p => p.ApartmentId)
            .OnDelete(DeleteBehavior.NoAction);

        // SupportRequest -> User (optional, userul poate fi anonim)
        modelBuilder.Entity<SupportRequest>()
            .HasOne(s => s.User)
            .WithMany()
            .HasForeignKey(s => s.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        // Session -> User
        modelBuilder.Entity<Session>()
            .HasOne(s => s.User)
            .WithMany()
            .HasForeignKey(s => s.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Owned types (stocate ca JSON in coloana apartamentului)
        modelBuilder.Entity<Apartment>()
            .OwnsOne(a => a.Location);

        modelBuilder.Entity<Apartment>()
            .OwnsOne(a => a.AdditionlaInfo);

        // Email unic
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();
        
        // Precizie decimal
        modelBuilder.Entity<Apartment>()
            .Property(a => a.CostPerInterval)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<Payment>()
            .Property(p => p.TotalCost)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<User>()
            .Property(u => u.AccountBalance)
            .HasColumnType("decimal(18,2)");
    }
}