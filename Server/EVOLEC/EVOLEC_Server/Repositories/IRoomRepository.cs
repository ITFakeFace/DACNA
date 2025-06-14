using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models;

namespace EVOLEC_Server.Repositories
{
    public interface IRoomRepository
    {
        Task<Room?> GetRoomByIdAsync(int id);
        Task<IEnumerable<Room>> GetAllRoomsAsync();
        Task<Room> AddRoomAsync(Room room);
        Task<bool> UpdateRoomAsync(Room room);
        Task<bool> DeleteRoomAsync(int id);

        // Extra
        Task<bool> IsRoomNameUniqueAsync(string name, int? excludeId = null);
        Task<List<Room>> GetAvailableRoomsInTime(DateOnly date, TimeOnly startTime, TimeOnly endTime);

        Task<List<LessonDate>> GetRoomScheduleAsync(int id);
    }
}
