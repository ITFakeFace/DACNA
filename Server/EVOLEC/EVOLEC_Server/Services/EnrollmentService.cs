using AutoMapper;
using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models;
using EVOLEC_Server.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EVOLEC_Server.Services
{
    public class EnrollmentService : IEnrollmentService
    {
        private readonly IEnrollmentRepository _enrollmentRepository;
        private readonly IMapper _mapper;

        public EnrollmentService(IEnrollmentRepository enrollmentRepository,IMapper mapper)
        {
            _enrollmentRepository = enrollmentRepository;
            _mapper = mapper;


        }

        public async Task<Enrollment> GetEnrollmentByIdAsync(int id)
        {
            return await _enrollmentRepository.GetEnrollmentByIdAsync(id);
        }

        public async Task<IEnumerable<EnrollmentDto>> GetAllEnrollmentsAsync()
        {
            var enrollment = await _enrollmentRepository.GetAllEnrollmentsAsync();
            return _mapper.Map<IEnumerable<EnrollmentDto>>(enrollment);
        }

        public Task<Enrollment> CreateEnrollmentAsync(EnrollmentDto enrollmentDto)
        {
            throw new NotImplementedException();
        }

        public Task<Enrollment> UpdateEnrollmentAsync(EnrollmentDto enrollmentDto)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteEnrollmentAsync(int id)
        {
            throw new NotImplementedException();
        }
    }
}
