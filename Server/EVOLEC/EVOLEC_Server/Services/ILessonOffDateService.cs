using EVOLEC_Server.Dtos;

namespace EVOLEC_Server.Services
{
    public interface ILessonOffDateService
    {
        Task<LessonOffDateDto> GetAsync(int lessonDateId, int offDateId);
        Task<IEnumerable<LessonOffDateDto>> GetAllAsync();
        Task<LessonOffDateDto> CreateAsync(LessonOffDateCreateDto createDto);
        Task<bool> UpdateAsync(LessonOffDateUpdateDto updateDto); // Đã thay đổi
        Task<bool> DeleteAsync(int lessonDateId, int offDateId);
    }
}
