using EVOLEC_Server.CustomException;
using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models;
using EVOLEC_Server.Repositories;
using Microsoft.AspNetCore.Identity;

namespace EVOLEC_Server.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly UserManager<ApplicationUser> _userManager;

        public UserService(IUserRepository userRepository, UserManager<ApplicationUser> userManager)
        {
            _userRepository = userRepository;
            _userManager = userManager;
        }

        // Tạo người dùng mới
        public async Task<bool> Create(UserCreateDto model)
        {
            return await _userRepository.Create(model);
        }

        // Xóa người dùng
        public async Task<bool> Delete(string userId)
        {
            return await _userRepository.Delete(userId);
        }

        // Lấy tất cả người dùng
        public async Task<List<ApplicationUser>> FindAll()
        {
            return await _userRepository.FindAll();
        }

        // Tìm người dùng theo Id
        public async Task<ApplicationUser?> FindById(string id)
        {
            return await _userRepository.FindById(id);
        }

        // Cập nhật thông tin người dùng
        public async Task<bool> Update(string userId, UserCreateDto model)
        {
            return await _userRepository.Update(userId, model);
        }

        // Thay đổi trạng thái (ban/unban) của người dùng
        public async Task<bool> ToggleStatus(string userId, bool isEnable)
        {
            // Kiểm tra xem người dùng có phải là admin không, không thể ban admin
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

            var roles = await _userManager.GetRolesAsync(user);
            if (roles.Contains("ADMIN"))
            {
                throw new AdminBanException("Cannot ban an admin user.");
            }

            return await _userRepository.ToggleStatus(userId, isEnable);
        }
    }
}
