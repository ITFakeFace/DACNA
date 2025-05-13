using EVOLEC_Server.Models;

namespace EVOLEC_Server.Repositories
{
    public interface ILessonOffDateRepository
    {
        Task<LessonOffDate> GetAsync(int lessonDateId, int offDateId);
        Task<IEnumerable<LessonOffDate>> GetAllAsync();
        Task<LessonOffDate> AddAsync(LessonOffDate lessonOffDate);
        Task<bool> UpdateAsync(LessonOffDate lessonOffDate);
        Task<bool> DeleteAsync(int lessonDateId, int offDateId);
    }
}
