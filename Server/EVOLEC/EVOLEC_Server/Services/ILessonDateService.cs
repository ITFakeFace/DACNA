using EVOLEC_Server.Dtos;

namespace EVOLEC_Server.Services
{
    public interface ILessonDateService
    {
        Task<LessonDateDto> GetLessonDateByIdAsync(int id);
        Task<IEnumerable<LessonDateDto>> GetLessonDatesByClassIdAsync(int id);
        Task<LessonDateDto> CreateLessonDateAsync(LessonDateCreateDto lessonDateCreateDto);
        Task<int> UpdateLessonDateAsync(int id, LessonDateUpdateDto lessonDateUpdateDto);
        Task<bool> DeleteLessonDateAsync(int id);
    }
}
