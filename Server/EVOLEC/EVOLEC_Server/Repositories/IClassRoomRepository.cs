using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models;

namespace EVOLEC_Server.Repositories
{
    public interface IClassRoomRepository
    {
        Task<ClassRoom?> GetClassRoomByIdAsync(int id);
        Task<IEnumerable<ClassRoom>> GetAllClassRoomsAsync();
        Task<int> AddClassRoomAsync(ClassRoom classRoom);
        Task<bool> UpdateClassRoomAsync(ClassRoom classRoom);
        Task<bool> DeleteClassRoomAsync(int id);
    }
}
