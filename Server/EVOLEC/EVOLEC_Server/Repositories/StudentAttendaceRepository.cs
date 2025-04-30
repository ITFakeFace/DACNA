using EVOLEC_Server.Models;
using Microsoft.EntityFrameworkCore;

namespace EVOLEC_Server.Repositories
{
    public class StudentAttendanceRepository : IStudentAttendanceRepository
    {
        private readonly EVOLECDbContext _ctx;

        public StudentAttendanceRepository(EVOLECDbContext context)
        {
            _ctx = context;
        }

        public async Task<StudentAttendance> GetStudentAttendanceByIdAsync(int id)
        {
            return await _ctx.StudentAttendances.FindAsync(id);
        }

        public async Task<IEnumerable<StudentAttendance>> GetAllStudentAttendancesAsync()
        {
            return await _ctx.StudentAttendances.ToListAsync();
        }

        public async Task<StudentAttendance> AddStudentAttendanceAsync(StudentAttendance studentAttendance)
        {
            _ctx.StudentAttendances.Add(studentAttendance);
            await _ctx.SaveChangesAsync();
            return studentAttendance;
        }

        public async Task<bool> UpdateStudentAttendanceAsync(StudentAttendance studentAttendance)
        {
            _ctx.StudentAttendances.Update(studentAttendance);
            return await _ctx.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteStudentAttendanceAsync(int id)
        {
            var studentAttendance = await GetStudentAttendanceByIdAsync(id);
            if (studentAttendance == null) return false;

            _ctx.StudentAttendances.Remove(studentAttendance);
            return await _ctx.SaveChangesAsync() > 0;
        }
    }
}
