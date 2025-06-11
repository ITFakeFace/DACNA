using AutoMapper;
using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models;
using EVOLEC_Server.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EVOLEC_Server.Services
{
    public class EnrollmentService : IEnrollmentService
    {
        private readonly IEnrollmentRepository _enrollmentRepository;
        private readonly IUserRepository _userRepository;
        private readonly IClassRoomRepository _classRoomRepository;
        private readonly IMapper _mapper;

        public EnrollmentService(IEnrollmentRepository enrollmentRepository,
                                 IMapper mapper,
                                 IUserRepository userRepository,
                                 IClassRoomRepository classRoomRepository
                                 )
        {
            _enrollmentRepository = enrollmentRepository;
            _userRepository = userRepository;
            _classRoomRepository = classRoomRepository;
            _mapper = mapper;

        }

        public async Task<Enrollment> GetEnrollmentByIdAsync(int id)
        {
            return await _enrollmentRepository.GetEnrollmentByIdAsync(id);
        }

        public async Task<IEnumerable<EnrollmentResponseDTO>> GetAllEnrollmentsAsync()
        {

            return await _enrollmentRepository.GetAllEnrollmentsAsync();
        }

        public async Task<int> CreateAsync(EnrollmentCreateDTO dto)
        {
            try
            {
                // Kiểm tra Student có tồn tại không
                ApplicationUser? student = await _userRepository.FindById(dto.StudentId);
                if (student == null)
                {
                    return -1;
                }

                // Kiểm tra ClassRoom có tồn tại không
                ClassRoom? classRoom = await _classRoomRepository.GetClassRoomByIdAsync(dto.ClassRoomId);
                if (classRoom == null)
                {
                    return -2;
                }

                // Tạo đối tượng Enrollment
                var entity = _mapper.Map<Enrollment>(dto);
                Enrollment addedEnrollment = await _enrollmentRepository.AddEnrollmentAsync(entity);

                return addedEnrollment.Id;
            }
            catch (Exception ex)
            {
                // Xử lý lỗi
                return -3;
            }
        }

        public Task<Enrollment> UpdateEnrollmentAsync(EnrollmentDto enrollmentDto)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteEnrollmentAsync(int id)
        {
            throw new NotImplementedException();
        }
        public async Task<int> UpdateAsync(int id, EnrollmentUpdateDTO dto)
        {
            try
            {
                // Kiểm tra nếu Enrollment có tồn tại không
                var enrollment = await _enrollmentRepository.GetEnrollmentByIdAsync(id);
                if (enrollment == null)
                {
                    return -1; // Enrollment không tồn tại
                }

                // Kiểm tra nếu StudentId có tồn tại không
                ApplicationUser? student = await _userRepository.FindById(dto.StudentId);
                if (student == null)
                {
                    return -2; // Student không tồn tại
                }

                // Kiểm tra nếu ClassRoomId có tồn tại không
                ClassRoom? classRoom = await _classRoomRepository.GetClassRoomByIdAsync(dto.ClassRoomId);
                if (classRoom == null)
                {
                    return -2; // ClassRoom không tồn tại
                }

                // Cập nhật thông tin Enrollment
                enrollment.StudentId = dto.StudentId;
                enrollment.ClassRoomId = dto.ClassRoomId;
                enrollment.EnrollDate = dto.EnrollDate;
                enrollment.Status = dto.Status;

                // Cập nhật dữ liệu vào database
                await _enrollmentRepository.UpdateAsync(enrollment);

                return enrollment.Id; // Trả về Id của Enrollment đã cập nhật
            }
            catch (Exception ex)
            {
                return -3; // Lỗi không xác định
            }
        }


    }
}
