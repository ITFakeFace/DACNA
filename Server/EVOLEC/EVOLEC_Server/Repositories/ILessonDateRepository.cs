using EVOLEC_Server.Models;

namespace EVOLEC_Server.Repositories
{
    public interface ILessonDateRepository
    {
        Task<LessonDate> GetLessonDateByIdAsync(int id);
        Task<IEnumerable<LessonDate>> GetAllLessonDatesAsync();
        Task<LessonDate> AddLessonDateAsync(LessonDate lessonDate);
        Task<bool> UpdateLessonDateAsync(LessonDate lessonDate);
        Task<bool> DeleteLessonDateAsync(int id);
    }
}
