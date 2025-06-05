using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models;

namespace EVOLEC_Server.Services
{
    public interface ILessonDateService
    {
        Task<LessonDateDto> GetLessonDateByIdAsync(int id);
        Task<IEnumerable<LessonDateDto>> GetLessonDatesByClassIdAsync(int id);
        Task<LessonDateDto> CreateLessonDateAsync(LessonDateCreateDto lessonDateCreateDto);
        Task<int> UpdateLessonDateAsync(int id, LessonDateUpdateDto lessonDateUpdateDto);
        Task<bool> DeleteLessonDateAsync(int id);
        void AddLessonDatesToClassRoom(ClassRoom addedClassroom, DateOnly? startDate, int? shift);
    }
}
