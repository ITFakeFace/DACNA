using AutoMapper;
using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models;
using EVOLEC_Server.Repositories;

namespace EVOLEC_Server.Services
{
    public class ClassRoomService : IClassRoomService
    {
        private readonly IClassRoomRepository _repository;
        private readonly IUserRepository _userRepository;
        private readonly ILessonDateService _lessonDateService;
        private readonly IMapper _mapper;
        public ClassRoomService(IClassRoomRepository repository, IMapper mapper, IUserRepository userRepository, ILessonDateService lessonDateService)
        {
            _repository = repository;
            _mapper = mapper;
            _userRepository = userRepository;
            _lessonDateService = lessonDateService;
        }

        public async Task<int> CreateAsync(ClassRoomCreateDTO dto)
        {
            try
            {
                if (dto.Teacher1Id != null)
                {
                    ApplicationUser? teacher1 = await _userRepository.FindById(dto.Teacher1Id);
                    if (teacher1 == null)
                    {
                        return -1; // Teacher1Id không tồn tại
                    }

                    ApplicationUser? teacher2 = await _userRepository.FindById(dto.Teacher2Id);
                    if (teacher2 == null)
                    {
                        return -2; // Teacher2Id không tồn tại
                    }
                }

                var entity = _mapper.Map<ClassRoom>(dto);
                ClassRoom addedClassroom = await _repository.AddClassRoomAsync(entity);

                int lessonResult = await _lessonDateService.AddLessonDatesToClassRoom(addedClassroom);
                if (lessonResult != 1)
                {
                    return HandleAddLessonDatesResult(lessonResult); // Trả về mã lỗi tương ứng
                }

                return addedClassroom.Id;
            }
            catch (Exception ex)
            {
                return -3; // Exception không xác định
            }
        }

        private int HandleAddLessonDatesResult(int resultCode)
        {
            switch (resultCode)
            {
                case 0:
                    return -4; // Không có LessonDate sau khi xử lý ngày nghỉ
                case -2:
                    return -5; // Không thể gán giáo viên
                case -1:
                default:
                    return -6; // Lỗi không xác định trong AddLessonDatesToClassRoom
            }
        }


        public async Task<IEnumerable<ClassRoomDTO>> GetAllAsync()
        {
            var _classes = await _repository.GetAllClassRoomsAsync();

            var classRoomDtos = _classes.Select(classRoom => new ClassRoomDTO
            {
                Id = classRoom.Id,
                Teacher1 = classRoom.Teacher1 != null ? _mapper.Map<ShortInformationTeacher>(classRoom.Teacher1) : null,
                Teacher2 = _mapper.Map<ShortInformationTeacher>(classRoom.Teacher2),
                Creator = _mapper.Map<ShortInformationTeacher>(classRoom.Creator),

                Course = _mapper.Map<CourseDto>(classRoom.Course),

                // Ánh xạ các trườg khác
                StartDate = classRoom.StartDate,
                EndDate = classRoom.EndDate,
                Status = classRoom.Status,
                Shift = classRoom.Shift
            }).ToList();

            return classRoomDtos;
        }


        public async Task<ClassRoomDTO?> GetByIdAsync(int id)
        {
            var _class = await _repository.GetClassRoomByIdAsync(id);
            if (_class == null) { return null; }
            var classRoomDto = new ClassRoomDTO
            {
                Teacher1 = _class.Teacher1 != null ? _mapper.Map<ShortInformationTeacher>(_class.Teacher1) : null,
                Teacher2 = _class.Teacher2 != null ? _mapper.Map<ShortInformationTeacher>(_class.Teacher2) : null,
                Creator = _class.Creator != null ? _mapper.Map<ShortInformationTeacher>(_class.Creator) : null,
                Course = _mapper.Map<CourseDto>(_class.Course),

                StartDate = _class.StartDate,
                EndDate = _class.EndDate,
                Status = _class.Status,
                Shift = _class.Shift
            };
            return classRoomDto;
        }

        public async Task<int> UpdateAsync(int id, ClassRoomUpdateDto request)
        {
            try
            {
                var classRoom = await _repository.GetClassRoomByIdAsync(id);
                if (classRoom == null) return -1;

                // Cập nhật dữ liệu từ DTO sang entity
                _mapper.Map(request, classRoom);
                bool IsShiftHasValue = classRoom.Shift.HasValue;
                bool IsStartDateHasValue = classRoom.StartDate.HasValue;
                await _repository.UpdateClassRoomAsync(classRoom);
                
                if (IsShiftHasValue && IsStartDateHasValue) { return 1; }
                ;
                if (!IsShiftHasValue) { return 2; }
                ;
                if (!IsStartDateHasValue) { return 3; }
                return 4;

            }
            catch (Exception ex)
            {
                return -2;
            }
        }

        public async Task<IEnumerable<UserDto>> GetStudentsByIdAsync(int id)
        {
            var result = await _repository.GetStudentsByClassIdAsync(id);
            return _mapper.Map<IEnumerable<UserDto>>(result);
        }

    }
}
