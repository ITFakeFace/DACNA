using EVOLEC_Server.Dtos;
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

        public async Task<IEnumerable<EnrollmentResponseDTO>> GetAllEnrollmentsAsync()
        {
            var result = _ctx.Enrollments
                 .Include(e => e.Student)
                 .Include(e => e.Creator)
                 .Include(e => e.ClassRoom)
                     .ThenInclude(c => c.Course)
                 .Select(e => new EnrollmentResponseDTO
                 {
                     EnrollmentId = e.Id,
                     ClassRoomId = e.ClassRoomId,
                     StudentId = e.StudentId,
                     StudentName = e.Student.Fullname,
                     CreatorId = e.CreatorId,
                     CreatorName = e.Creator.Fullname,
                     ClassRoomName = e.ClassRoom.Course.Name!,
                     EnrollDate = e.EnrollDate,
                     Status = e.Status,
                     CreatedAt = e.CreatedAt,
                     UpdatedAt = (DateTime)e.UpdatedAt!
                 })
                 .ToList();

            return result;

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

        public async Task UpdateAsync(Enrollment entity)
        {
            _ctx.Enrollments.Update(entity);
            await _ctx.SaveChangesAsync();
        }

    }
}
