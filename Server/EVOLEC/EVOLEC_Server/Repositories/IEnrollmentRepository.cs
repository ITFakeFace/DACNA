using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models;

namespace EVOLEC_Server.Repositories
{
    public interface IEnrollmentRepository
    {
        Task<Enrollment> GetEnrollmentByIdAsync(int id);
        Task<IEnumerable<EnrollmentResponseDTO>> GetAllEnrollmentsAsync();
        Task<Enrollment> AddEnrollmentAsync(Enrollment enrollment);
        Task<bool> UpdateEnrollmentAsync(Enrollment enrollment);
        Task<bool> DeleteEnrollmentAsync(int id);
        Task UpdateAsync(Enrollment enrollment);
    }
}
