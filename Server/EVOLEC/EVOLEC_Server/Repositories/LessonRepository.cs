using EVOLEC_Server.Models;
using Microsoft.EntityFrameworkCore;

namespace EVOLEC_Server.Repositories
{
    public class LessonRepository : ILessonRepository
    {
        private readonly EVOLECDbContext _ctx;

        public LessonRepository(EVOLECDbContext context)
        {
            _ctx = context;
        }

        public async Task<Lesson> GetLessonByIdAsync(int id)
        {
            return await _ctx.Lessons.FindAsync(id);
        }

        public async Task<IEnumerable<Lesson>> GetAllLessonsAsync()
        {
            return await _ctx.Lessons.ToListAsync();
        }

        public async Task<IEnumerable<Lesson>> GetLessonByCourseIdAsync(int courseId)
        {
            return await _ctx.Lessons.Where(ls => ls.CourseId == courseId).ToListAsync();
        }

        public async Task<Lesson> AddLessonAsync(Lesson lesson)
        {
            _ctx.Lessons.Add(lesson);
            await _ctx.SaveChangesAsync();
            return lesson;
        }

        public async Task<bool> UpdateLessonAsync(Lesson lesson)
        {
            _ctx.Lessons.Update(lesson);
            return await _ctx.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteLessonAsync(int id)
        {
            var lesson = await GetLessonByIdAsync(id);
            if (lesson == null) return false;

            _ctx.Lessons.Remove(lesson);
            return await _ctx.SaveChangesAsync() > 0;
        }

    }
}
