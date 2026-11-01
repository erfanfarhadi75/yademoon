using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Yademoon.Domain;
using Yademoon.Infrastructure.Identity;

namespace Yademoon.Infrastructure.Persistence;

public class AppDbContext : IdentityDbContext<AppUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Person> People => Set<Person>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Person>(e =>
        {
            e.ToTable("people");
            e.HasKey(p => p.Id);
            e.Property(p => p.Name).HasMaxLength(100).IsRequired();
            e.Property(p => p.OwnerUserId).HasMaxLength(450).IsRequired();
            e.Property(p => p.BirthDate).HasColumnType("date").IsRequired();
            e.Property(p => p.Notes).HasMaxLength(1000);
            e.Property(p => p.Relation).HasConversion<int>();
            e.HasIndex(p => p.OwnerUserId);
        });
    }
}
