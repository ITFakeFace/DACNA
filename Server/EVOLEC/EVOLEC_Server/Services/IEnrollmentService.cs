using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EVOLEC_Server.Services
{
    public interface IEnrollmentService
    {
        Task<Enrollment> GetEnrollmentByIdAsync(int id);
        Task<IEnumerable<EnrollmentDto>> GetAllEnrollmentsAsync();
        Task<Enrollment> CreateEnrollmentAsync(EnrollmentDto enrollmentDto);
        Task<Enrollment> UpdateEnrollmentAsync(EnrollmentDto enrollmentDto);
        Task<bool> DeleteEnrollmentAsync(int id);
    }
}
