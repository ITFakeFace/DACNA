using EVOLEC_Server.Models;

namespace EVOLEC_Server.Repositories
{
    public interface IEnrollmentRepository
    {
        Task<Enrollment> GetEnrollmentByIdAsync(int id);
        Task<IEnumerable<Enrollment>> GetAllEnrollmentsAsync();
        Task<Enrollment> AddEnrollmentAsync(Enrollment enrollment);
        Task<bool> UpdateEnrollmentAsync(Enrollment enrollment);
        Task<bool> DeleteEnrollmentAsync(int id);
    }
}
