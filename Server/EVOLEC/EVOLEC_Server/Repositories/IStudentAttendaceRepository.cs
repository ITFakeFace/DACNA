using EVOLEC_Server.Models;

namespace EVOLEC_Server.Repositories
{
    public interface IStudentAttendanceRepository
    {
        Task<StudentAttendance> GetStudentAttendanceByIdAsync(int id);
        Task<IEnumerable<StudentAttendance>> GetAllStudentAttendancesAsync();
        Task<StudentAttendance> AddStudentAttendanceAsync(StudentAttendance studentAttendance);
        Task<bool> UpdateStudentAttendanceAsync(StudentAttendance studentAttendance);
        Task<bool> DeleteStudentAttendanceAsync(int id);
    }
}
