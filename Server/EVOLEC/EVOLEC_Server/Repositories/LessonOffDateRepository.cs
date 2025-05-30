using EVOLEC_Server.Models;
using Microsoft.EntityFrameworkCore;

namespace EVOLEC_Server.Repositories
{
    public class LessonOffDateRepository : ILessonOffDateRepository
    {
        private readonly EVOLECDbContext _ctx;

        public LessonOffDateRepository(EVOLECDbContext context)
        {
            _ctx = context;
        }

        public async Task<LessonOffDate> GetAsync(int lessonDateId, int offDateId)
        {
            return await _ctx.LessonOffDates.FindAsync(lessonDateId, offDateId);
        }

        public async Task<IEnumerable<LessonOffDate>> GetAllAsync()
        {
            return await _ctx.LessonOffDates
                .Include(l => l.LessonDate)
                .Include(o => o.OffDate)
                .ToListAsync();
        }
        public async Task<IEnumerable<LessonOffDate>> GetAllByOffDateIdAsync(int offDateId)
        {
            return await _ctx.LessonOffDates
                .Include(l => l.LessonDate)
                .Include(o => o.OffDate)
                .Where(lod => lod.OffDateId == offDateId)
                .ToListAsync();
        }
        public async Task<LessonOffDate> AddAsync(LessonOffDate lessonOffDate)
        {
            _ctx.LessonOffDates.Add(lessonOffDate);
            await _ctx.SaveChangesAsync();
            return lessonOffDate;
        }

        public async Task<bool> UpdateAsync(LessonOffDate lessonOffDate)
        {
            _ctx.LessonOffDates.Update(lessonOffDate);
            return await _ctx.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAsync(int lessonDateId, int offDateId)
        {
            var entity = await GetAsync(lessonDateId, offDateId);
            if (entity == null) return false;

            _ctx.LessonOffDates.Remove(entity);
            return await _ctx.SaveChangesAsync() > 0;
        }


    }
}
