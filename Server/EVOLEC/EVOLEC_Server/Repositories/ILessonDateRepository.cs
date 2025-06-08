using EVOLEC_Server.Models;

namespace EVOLEC_Server.Repositories
{
    public interface ILessonDateRepository
    {
        Task<LessonDate> GetLessonDateByIdAsync(int id);
        Task<IEnumerable<LessonDate>> GetLessonDatesAsyncByClassId(int id);
        Task<LessonDate> AddLessonDateAsync(LessonDate lessonDate);
        Task<int> UpdateLessonDateAsync(LessonDate lessonDate);
        Task<bool> DeleteLessonDateAsync(int id);
        Task<List<LessonDate>>? AddLessonDateByClassRoom(ClassRoom classRoom);
        Task<int> AddLessonDates(IEnumerable<LessonDate> lessonDates);
        Task<List<LessonDate>?> AssignTeacherToLessonDateInitFunc(List<LessonDate> lessonDates, int ShiftId, ClassRoom classRoom);
    }
}
