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

        public async Task<LessonDate?> GetLessonDateByIdAsync(int id)
        {
            return await _ctx.LessonDates
                              .Where(lsd => lsd.Id == id)
                              .Include(lsd => lsd.Lesson) // Include nếu bạn muốn dữ liệu `Lesson` đi kèm
                              .Include(lsd => lsd.Teacher)
                              .FirstOrDefaultAsync(); // Dùng FirstOrDefaultAsync thay vì FirstOrDefault
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

        public async Task<IEnumerable<LessonDate>> GetLessonDatesAsyncByClassId(int classId)
        {
            return await _ctx.LessonDates
                .Where(ld => ld.ClassRoomId == classId)
                .Include(ld=>ld.Teacher)
                .Include(ld=>ld.Lesson)
                .OrderBy(ld => ld.Date)
                .ToListAsync();
        }

    }
}
