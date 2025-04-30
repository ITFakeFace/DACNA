using EVOLEC_Server.Models;

namespace EVOLEC_Server.Repositories
{
    public interface ILessonRepository
    {
        Task<Lesson> GetLessonByIdAsync(int id);
        Task<IEnumerable<Lesson>> GetAllLessonsAsync();
        Task<IEnumerable<Lesson>> GetLessonByCourseIdAsync(int courseId);
        Task<Lesson> AddLessonAsync(Lesson lesson);
        Task<bool> UpdateLessonAsync(Lesson lesson);
        Task<bool> DeleteLessonAsync(int id);
    }
}
