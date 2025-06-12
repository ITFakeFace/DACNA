using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models;

namespace EVOLEC_Server.Services
{
    public interface ILessonOffDateService
    {
        Task<LessonOffDateDto> GetAsync(int lessonDateId, int offDateId);
        Task<IEnumerable<LessonOffDateDto>> GetAllAsync();
        Task<lessonOffDateClassResp> GetAllByOffDateIdAsync(int offDateId);
        Task<LessonOffDateDto> CreateAsync(LessonOffDateCreateDto createDto);
        Task<bool> UpdateAsync(LessonOffDateUpdateDto updateDto); // Đã thay đổi
        Task<bool> DeleteAsync(int lessonDateId, int offDateId);
        Task<List<LessonDate>?> HandleHolidays(List<LessonDate> lessonDates);
    }
}
