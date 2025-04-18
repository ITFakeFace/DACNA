
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace EVOLEC_Server.Models
{
    public class EVOLECDbContext : IdentityDbContext<ApplicationUser>
    {
        public EVOLECDbContext(DbContextOptions<EVOLECDbContext> options) : base(options)
        {
        }

        public DbSet<Course> Courses { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Đổi tên bảng mặc định của Identity
            builder.Entity<ApplicationUser>().ToTable("tblUsers");
            builder.Entity<IdentityRole>().ToTable("tblRoles");
            builder.Entity<IdentityUserRole<string>>().ToTable("tblUserRoles");
            builder.Entity<IdentityUserClaim<string>>().ToTable("tblUserClaims");
            builder.Entity<IdentityUserLogin<string>>().ToTable("tblUserLogins");
            builder.Entity<IdentityUserToken<string>>().ToTable("tblUserTokens");
            builder.Entity<IdentityRoleClaim<string>>().ToTable("tblRoleClaims");

            builder.Entity<Course>().ToTable("tblCourses");
        }

        // Nếu dùng async
        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.Entity is EntityWithTimeStamp &&
                            (e.State == EntityState.Added || e.State == EntityState.Modified));

            foreach (var entityEntry in entries)
            {
                var now = DateTime.UtcNow;

                if (entityEntry.State == EntityState.Added)
                {
                    ((EntityWithTimeStamp)entityEntry.Entity).CreatedAt = now;
                }

                ((EntityWithTimeStamp)entityEntry.Entity).UpdatedAt = now;
            }

            return await base.SaveChangesAsync(cancellationToken);
        }
    }
}
