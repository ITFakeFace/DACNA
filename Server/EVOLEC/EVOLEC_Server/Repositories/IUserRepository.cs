using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models;

namespace EVOLEC_Server.Repositories
{
    public interface IUserRepository
    {
        Task<List<ApplicationUser>> FindAll();
        Task<ApplicationUser?> FindById(string id);
        Task<bool> Create(UserCreateDto model);
        Task<bool> Update(string userId, UserCreateDto model);
        Task<bool> Delete(string userId);
        Task<bool> ToggleStatus(string userId, bool status);

    }
}
