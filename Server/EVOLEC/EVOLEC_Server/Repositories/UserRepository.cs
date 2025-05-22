using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EVOLEC_Server.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly EVOLECDbContext _ctx;
        private readonly IWebHostEnvironment _env;
        private readonly UserManager<ApplicationUser> _userManager;
        public UserRepository(EVOLECDbContext ctx, IWebHostEnvironment env, UserManager<ApplicationUser> userManager)
        {
            _ctx = ctx;
            _env = env;
            _userManager = userManager;
        }
        public async Task<List<ApplicationUser>> FindAll()
        {
            return await _ctx.Users.ToListAsync();
        }

        public Task<ApplicationUser?> FindById(string id)
        {
            Console.WriteLine("\nFindUserId\n");
            return _ctx.Users.FirstOrDefaultAsync(u => u.Id.Equals(id));
        }

        public async Task<bool> Create(UserCreateDto model)
        {
            var user = new ApplicationUser
            {
                Email = model.Email,
                UserName = model.UserName,
                PhoneNumber = model.Phone,
                Dob = model.Dob,
                Address = model.Address,
                Fullname = model.Fullname,
                Gender = model.Gender,
                PID = model.PID,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
            };
            if ((await _userManager.CreateAsync(user, model.Password)).Succeeded)
            {
                var result = await _userManager.AddToRoleAsync(user, model.Role);
                return result.Succeeded;
            }
            return false;
        }

        public async Task<bool> Delete(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user != null && (await _userManager.DeleteAsync(user)).Succeeded)
            {
                return true;
            }
            return false;
        }

        [HttpGet]
        public async Task<bool> ToggleStatus(string userId, bool isEnable)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

            // Đảm bảo user có thể bị lock
            await _userManager.SetLockoutEnabledAsync(user, true);

            var lockoutEnd = isEnable ? (DateTimeOffset?)null : DateTimeOffset.UtcNow.AddYears(100);
            var result = await _userManager.SetLockoutEndDateAsync(user, lockoutEnd);

            return result.Succeeded;
        }


        public async Task<bool> Update(string userId, UserUpdateDto model)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user != null)
            {
                user.Email = model.Email;
                user.UserName = model.UserName;
                user.PhoneNumber = model.Phone;
                user.Dob = model.Dob;
                user.Address = model.Address;
                user.Fullname = model.Fullname;
                user.Gender = model.Gender;
                user.PID = model.PID;
                user.UpdatedAt = DateTime.Now;

                // Quản lý password
                if (model.Password != string.Empty && model.Password.Equals(model.ConfirmPassword))
                {
                    Console.WriteLine("Changing password");
                    var result = await _userManager.RemovePasswordAsync(user);
                    if (result.Succeeded)
                        result = await _userManager.AddPasswordAsync(user, model.Password);
                }

                // Quản lý role
                if (!await _userManager.IsInRoleAsync(user, model.Role))
                {
                    var roles = await _userManager.GetRolesAsync(user);
                    if (roles.Count > 0)
                    {
                        var role = await _userManager.GetRolesAsync(user);
                        await _userManager.RemoveFromRoleAsync(user, role.First());
                    }
                    var result = await _userManager.AddToRoleAsync(user, model.Role);
                }
                _ctx.Users.Update(user);
                return await _ctx.SaveChangesAsync() > 0;
            }
            return false;
        }
    }
}
