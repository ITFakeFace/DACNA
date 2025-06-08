using EVOLEC_Server.Dtos;
using EVOLEC_Server.DTOs.Lesson;
using EVOLEC_Server.Models;

namespace EVOLEC_Server.Services
{
    public interface IOffDateService
    {
        Task<IEnumerable<OffDateDto>> GetAllOffDatesAsync();
        Task<OffDateDto> GetOffDateByIdAsync(int id);
        Task<OffDateDto> CreateOffDateAsync(OffDateCreateDto dto);
        Task<bool> UpdateOffDateAsync(int id, OffDateUpdateDto dto);
        Task<bool> DeleteOffDateAsync(int id);
        Task<List<ClassRoomDTO>> GetAffectedClassByOffDateId(int id);
        Task<List<OffDate>> GetOffHolidaysInRangeAsync(DateOnly minDate, DateOnly maxDate);
    }
}
