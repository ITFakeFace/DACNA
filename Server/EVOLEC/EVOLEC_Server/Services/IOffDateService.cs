using EVOLEC_Server.Dtos;
using EVOLEC_Server.DTOs.Lesson;

namespace EVOLEC_Server.Services
{
    public interface IOffDateService
    {
        Task<IEnumerable<OffDateDto>> GetAllOffDatesAsync();
        Task<OffDateDto> GetOffDateByIdAsync(int id);
        Task<OffDateDto> CreateOffDateAsync(OffDateCreateDto dto);
        Task<bool> UpdateOffDateAsync(int id, OffDateUpdateDto dto);
        Task<bool> DeleteOffDateAsync(int id);
    }
}
