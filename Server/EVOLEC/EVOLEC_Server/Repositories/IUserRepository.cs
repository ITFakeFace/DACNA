using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models;
using Microsoft.AspNetCore.Identity;

namespace EVOLEC_Server.Repositories
{
    public interface IUserRepository
    {
        Task<List<ApplicationUser>> FindAll(bool? enable = null);
        Task<ApplicationUser?> FindById(string id);
        Task<bool> Create(UserCreateDto model);
        Task<bool> Update(string userId, UserUpdateDto model);
        Task<bool> Delete(string userId);
        Task<bool> ToggleStatus(string userId, bool status);
        Task<List<ApplicationUser>> GetUsersByRoleAsync(string roleName, bool? enable = null);
        Task<List<LessonDate>> GetStudyingLessonDate(string studentId);
        Task<List<LessonDate>> GetTeachingLessonDate(string teacherId);
        Task<List<ClassRoom>> GetStudyClassRoom(string studentId);
        Task<List<ClassRoom>> GetTeachClassRoom(string teacherId);

    }
}
