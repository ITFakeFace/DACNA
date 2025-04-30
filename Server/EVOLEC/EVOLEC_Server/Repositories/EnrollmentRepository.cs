using EVOLEC_Server.Models;
using Microsoft.EntityFrameworkCore;

namespace EVOLEC_Server.Repositories
{
    public class EnrollmentRepository : IEnrollmentRepository
    {
        private readonly EVOLECDbContext _ctx;

        public EnrollmentRepository(EVOLECDbContext context)
        {
            _ctx = context;
        }

        public async Task<Enrollment> GetEnrollmentByIdAsync(int id)
        {
            return await _ctx.Enrollments.FindAsync(id);
        }

        public async Task<IEnumerable<Enrollment>> GetAllEnrollmentsAsync()
        {
            return await _ctx.Enrollments.ToListAsync();
        }

        public async Task<Enrollment> AddEnrollmentAsync(Enrollment enrollment)
        {
            _ctx.Enrollments.Add(enrollment);
            await _ctx.SaveChangesAsync();
            return enrollment;
        }

        public async Task<bool> UpdateEnrollmentAsync(Enrollment enrollment)
        {
            _ctx.Enrollments.Update(enrollment);
            return await _ctx.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteEnrollmentAsync(int id)
        {
            var enrollment = await GetEnrollmentByIdAsync(id);
            if (enrollment == null) return false;

            _ctx.Enrollments.Remove(enrollment);
            return await _ctx.SaveChangesAsync() > 0;
        }
    }
}
