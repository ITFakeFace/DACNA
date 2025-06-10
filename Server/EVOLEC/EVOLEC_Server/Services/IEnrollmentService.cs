using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EVOLEC_Server.Services
{
    public interface IEnrollmentService
    {
        Task<Enrollment> GetEnrollmentByIdAsync(int id);
        Task<IEnumerable<EnrollmentResponseDTO>> GetAllEnrollmentsAsync();
        Task<Enrollment> UpdateEnrollmentAsync(EnrollmentDto enrollmentDto);
        Task<bool> DeleteEnrollmentAsync(int id);
        Task<int> CreateAsync(EnrollmentCreateDTO request);
        Task<int> UpdateAsync(int id, EnrollmentUpdateDTO request);
    }
}
