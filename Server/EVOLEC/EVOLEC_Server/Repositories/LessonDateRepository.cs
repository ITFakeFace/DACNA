using EVOLEC_Server.Models;
using Microsoft.EntityFrameworkCore;

namespace EVOLEC_Server.Repositories
{
    public class LessonDateRepository : ILessonDateRepository
    {
        private readonly EVOLECDbContext _ctx;

        public LessonDateRepository(EVOLECDbContext context)
        {
            _ctx = context;
        }

        public async Task<LessonDate> GetLessonDateByIdAsync(int id)
        {
            return await _ctx.LessonDates.FindAsync(id);
        }

        public async Task<IEnumerable<LessonDate>> GetAllLessonDatesAsync()
        {
            return await _ctx.LessonDates.ToListAsync();
        }

        public async Task<LessonDate> AddLessonDateAsync(LessonDate lessonDate)
        {
            _ctx.LessonDates.Add(lessonDate);
            await _ctx.SaveChangesAsync();
            return lessonDate;
        }

        public async Task<bool> UpdateLessonDateAsync(LessonDate lessonDate)
        {
            _ctx.LessonDates.Update(lessonDate);
            return await _ctx.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteLessonDateAsync(int id)
        {
            var lessonDate = await GetLessonDateByIdAsync(id);
            if (lessonDate == null) return false;

            _ctx.LessonDates.Remove(lessonDate);
            return await _ctx.SaveChangesAsync() > 0;
        }
    }
}
