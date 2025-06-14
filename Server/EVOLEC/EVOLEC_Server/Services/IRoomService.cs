using EVOLEC_Server.Dtos;

namespace EVOLEC_Server.Services
{
    public interface IRoomService
    {
        Task<RoomDto?> GetRoomByIdAsync(int id);
        Task<IEnumerable<RoomDto>> GetAllRoomsAsync();
        Task<RoomDto> CreateRoomAsync(RoomCreateDto dto);
        Task<bool> UpdateRoomAsync(int id, RoomUpdateDto dto);
        Task<bool> DeleteRoomAsync(int id);
        Task<bool> IsRoomNameUniqueAsync(string name, int? excludeId = null);
        Task<List<LessonDateScheduleDto>> GetRoomScheduleAsync(int id);
    }
}
