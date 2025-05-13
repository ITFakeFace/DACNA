
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace EVOLEC_Server.Models
{
    public class EVOLECDbContext : IdentityDbContext<ApplicationUser>
    {
        public EVOLECDbContext(DbContextOptions<EVOLECDbContext> options) : base(options)
        {
        }

        public DbSet<Course> Courses { get; set; }
        public DbSet<ClassRoom> ClassRooms { get; set; }
        public DbSet<Lesson> Lessons { get; set; }
        public DbSet<LessonDate> LessonDates { get; set; }
        public DbSet<LessonOffDate> LessonOffDates { get; set; }
        public DbSet<OffDate> OffDates { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }
        public DbSet<StudentAttendance> StudentAttendances { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Default Identity Table
            builder.Entity<ApplicationUser>().ToTable("tblUsers");
            builder.Entity<IdentityRole>().ToTable("tblRoles");
            builder.Entity<IdentityUserRole<string>>().ToTable("tblUserRoles");
            builder.Entity<IdentityUserClaim<string>>().ToTable("tblUserClaims");
            builder.Entity<IdentityUserLogin<string>>().ToTable("tblUserLogins");
            builder.Entity<IdentityUserToken<string>>().ToTable("tblUserTokens");
            builder.Entity<IdentityRoleClaim<string>>().ToTable("tblRoleClaims");
            // Additional Table
            builder.Entity<Course>().ToTable("tblCourses");
            builder.Entity<ClassRoom>().ToTable("tblClassRooms");
            builder.Entity<Lesson>().ToTable("tblLessons");
            builder.Entity<LessonDate>().ToTable("tblLessonDates");
            builder.Entity<LessonOffDate>().ToTable("tblLessonOffDates");
            builder.Entity<OffDate>().ToTable("tblOffDates");
            builder.Entity<Enrollment>().ToTable("tblEnrollments");
            builder.Entity<StudentAttendance>().ToTable("tblStudentAttendances");

            builder.Entity<StudentAttendance>()
                .HasKey(sa => new { sa.StudentId, sa.LessonDateId });

            // 
            builder.Entity<ClassRoom>()
                .HasOne(c => c.Teacher1)
                .WithMany(u => u.Teacher1ClassRooms)
                .HasForeignKey(c => c.Teacher1Id)
                .OnDelete(DeleteBehavior.Restrict); // 👈 Tránh lỗi vòng lặp khi xóa

            builder.Entity<ClassRoom>()
                .HasOne(c => c.Teacher2)
                .WithMany(u => u.Teacher2ClassRooms)
                .HasForeignKey(c => c.Teacher2Id)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<ClassRoom>()
                .HasOne(c => c.Creator)
                .WithMany() // 👈 Nếu bạn không cần navigation ngược
                .HasForeignKey(c => c.CreatorId)
                .OnDelete(DeleteBehavior.Restrict);


            // 1. Mối quan hệ Student
            builder.Entity<Enrollment>()
                .HasOne(e => e.Student)
                .WithMany(u => u.StudentEnrollments) // 👈 bạn cần thêm navigation này ở ApplicationUser
                .HasForeignKey(e => e.StudentId)
                .OnDelete(DeleteBehavior.Restrict);

            // 2. Mối quan hệ Creator
            builder.Entity<Enrollment>()
                .HasOne(e => e.Creator)
                .WithMany(u => u.CreatedEnrollments) // 👈 bạn cũng cần thêm navigation này ở ApplicationUser
                .HasForeignKey(e => e.CreatorId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Enrollment>()
                .HasOne(e => e.ClassRoom)                  // navigation ngược về ClassRoom
                .WithMany(c => c.CreatorEnrollments)       // navigation từ ClassRoom đến danh sách Enrollment
                .HasForeignKey(e => e.ClassRoomId)         // tên khóa ngoại trong Enrollment
                .OnDelete(DeleteBehavior.Restrict);         // hoặc Restrict nếu bạn muốn

            // LessonOffDate Composite Key
            builder.Entity<LessonOffDate>()
                .HasKey(lod => new { lod.LessonDateId, lod.OffDateId }); // Composite Key

            builder.Entity<LessonOffDate>()
                .HasOne(lod => lod.LessonDate)
                .WithMany(ld => ld.LessonOffDates)
                .HasForeignKey(lod => lod.LessonDateId);

            builder.Entity<LessonOffDate>()
                .HasOne(lod => lod.OffDate)
                .WithMany(od => od.LessonOffDates)
                .HasForeignKey(lod => lod.OffDateId);

            // Thiết lập Cascade cho tất cả quan hệ còn lại (ngoại trừ ApplicationUser, Enrollment, ClassRoom, Course)
            foreach (var entity in builder.Model.GetEntityTypes())
            {
                foreach (var fk in entity.GetForeignKeys())
                {
                    var principalName = fk.PrincipalEntityType.ClrType.Name;

                    if (principalName == nameof(ApplicationUser) ||
                        principalName == nameof(Enrollment) ||
                        principalName == nameof(ClassRoom) ||
                        principalName == nameof(Course))
                    {
                        fk.DeleteBehavior = DeleteBehavior.Restrict;
                    }
                    else
                    {
                        fk.DeleteBehavior = DeleteBehavior.Cascade;
                    }
                }
            }
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
