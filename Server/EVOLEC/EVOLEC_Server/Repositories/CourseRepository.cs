using EVOLEC_Server.Models;
using Microsoft.EntityFrameworkCore;

namespace EVOLEC_Server.Repositories
{
    public class CourseRepository : ICourseRepository
    {
        private readonly EVOLECDbContext _ctx;

        public CourseRepository(EVOLECDbContext context)
        {
            _ctx = context;
        }

        public async Task<Course> GetCourseByIdAsync(int id)
        {
            return await _ctx.Courses.FindAsync(id);
        }

        public async Task<IEnumerable<Course>> GetAllCoursesAsync()
        {
            return await _ctx.Courses.ToListAsync();
        }

        public async Task<Course> AddCourseAsync(Course course)
        {
            _ctx.Courses.Add(course);
            await _ctx.SaveChangesAsync();
            return course;
        }

        public async Task<bool> UpdateCourseAsync(Course course)
        {
            _ctx.Courses.Update(course);
            return await _ctx.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteCourseAsync(int id)
        {
            var course = await GetCourseByIdAsync(id);
            if (course == null) return false;

            _ctx.Courses.Remove(course);
            return await _ctx.SaveChangesAsync() > 0;
        }
    }

}
