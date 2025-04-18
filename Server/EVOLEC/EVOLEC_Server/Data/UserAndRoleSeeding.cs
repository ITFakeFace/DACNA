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

            string[] roles = { "ADMIN", "STAFF", "TEACHER", "STUDENT" };

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
            var staff = new ApplicationUser
            {
                Email = "staff@example.com",
                PhoneNumber = "0900000002",
                Fullname = "Staff",
                Dob = DateOnly.Parse("2000/01/01"),
                UserName = "Staff",
                Gender = 1,
                PID = "079200000002",
                UpdatedAt = DateTime.Now,
                CreatedAt = DateTime.Now,
            };
            var teacher = new ApplicationUser
            {
                Email = "teacher@example.com",
                PhoneNumber = "0900000003",
                Fullname = "Teacherr",
                Dob = DateOnly.Parse("2000/01/01"),
                UserName = "Teacher",
                Gender = 1,
                PID = "079200000003",
                UpdatedAt = DateTime.Now,
                CreatedAt = DateTime.Now,
            };
            var student = new ApplicationUser
            {
                Email = "student@example.com",
                PhoneNumber = "0900000004",
                Fullname = "Student",
                Dob = DateOnly.Parse("2000/01/01"),
                UserName = "Student",
                Gender = 1,
                PID = "079200000004",
                UpdatedAt = DateTime.Now,
                CreatedAt = DateTime.Now,
            };
            await CreateUser(userManager, admin, "123456", "ADMIN");
            await CreateUser(userManager, staff, "123456", "STAFF");
            await CreateUser(userManager, teacher, "123456", "TEACHER");
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
