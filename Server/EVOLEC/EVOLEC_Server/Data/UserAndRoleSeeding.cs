using EVOLEC_Server.Models;
using Microsoft.AspNetCore.Identity;

namespace EVOLEC_Server.Data
{
    public static class UserAndRoleSeeding
    {
        public static async Task SeedRolesAndUsers(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            string[] roles = { "ADMIN", "ENROLLMENT_STAFF", "ACADEMIC_ADMIN", "TEACHER", "STUDENT" };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }
            var admin = new ApplicationUser
            {
                Email = "admin@example.com",
                PhoneNumber = "0900000001",
                Fullname = "Administrator",
                Dob = DateOnly.Parse("2000/01/01"),
                UserName = "Admin",
                Gender = 1,
                PID = "079200000001",
                UpdatedAt = DateTime.Now,
                CreatedAt = DateTime.Now,
            };
            var academic_admin = new ApplicationUser
            {
                Email = "academic_admin@example.com",
                PhoneNumber = "0900000002",
                Fullname = "Academic Administrator",
                Dob = DateOnly.Parse("2000/01/01"),
                UserName = "AcademicAdmin",
                Gender = 1,
                PID = "079200000002",
                UpdatedAt = DateTime.Now,
                CreatedAt = DateTime.Now,
            };
            var enrollment_staff = new ApplicationUser
            {
                Email = "enrollment_staff@example.com",
                PhoneNumber = "0900000003",
                Fullname = "Enrollment Staff",
                Dob = DateOnly.Parse("2000/01/01"),
                UserName = "EnrollmentStaff",
                Gender = 1,
                PID = "079200000003",
                UpdatedAt = DateTime.Now,
                CreatedAt = DateTime.Now,
            };
            var teacher = new ApplicationUser
            {
                Email = "teacher@example.com",
                PhoneNumber = "0900000004",
                Fullname = "Teacher",
                Dob = DateOnly.Parse("2000/01/01"),
                UserName = "Teacher",
                Gender = 1,
                PID = "079200000004",
                UpdatedAt = DateTime.Now,
                CreatedAt = DateTime.Now,
            };
            var teacher1 = new ApplicationUser
            {
                Email = "teacher1@example.com",
                PhoneNumber = "0900000005",
                Fullname = "TeacherA",
                Dob = DateOnly.Parse("2000/02/01"),
                UserName = "TeacherA",
                Gender = 1,
                PID = "079200000005",
                UpdatedAt = DateTime.Now,
                CreatedAt = DateTime.Now,
            };
            var student = new ApplicationUser
            {
                Email = "student@example.com",
                PhoneNumber = "0900000005",
                Fullname = "Student",
                Dob = DateOnly.Parse("2000/01/01"),
                UserName = "Student",
                Gender = 1,
                PID = "079200000005",
                UpdatedAt = DateTime.Now,
                CreatedAt = DateTime.Now,
            };
            await CreateUser(userManager, admin, "123456", "ADMIN");
            await CreateUser(userManager, enrollment_staff, "123456", "ENROLLMENT_STAFF");
            await CreateUser(userManager, academic_admin, "123456", "ACADEMIC_ADMIN");
            await CreateUser(userManager, teacher, "123456", "TEACHER");
            await CreateUser(userManager, teacher1, "123456", "TEACHER");
            await CreateUser(userManager, student, "123456", "STUDENT");
        }

        private static async Task CreateUser(UserManager<ApplicationUser> userManager, ApplicationUser model, string password, string role)
        {
            var user = await userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                var result = await userManager.CreateAsync(model, password);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(model, role);
                }
                else
                {
                    // In lỗi nếu không tạo được user
                    foreach (var error in result.Errors)
                    {
                        Console.WriteLine($"Error: {error.Description}");
                    }
                }
            }
        }
    }
}
