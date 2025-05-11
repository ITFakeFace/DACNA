using AutoMapper;
using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models;
using EVOLEC_Server.Repositories;

namespace EVOLEC_Server.Services
{
    public class ClassRoomService : IClassRoomService
    {
        private readonly IClassRoomRepository _repository;
        private readonly IMapper _mapper;
        public ClassRoomService(IClassRoomRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<int> CreateAsync(ClassRoomCreateDTO dto)
        {
            var entity = _mapper.Map<ClassRoom>(dto);
            ClassRoom addedClassroom = await _repository.AddClassRoomAsync(entity);

                        

            return addedClassroom.Id;
        }


        public async Task<IEnumerable<ClassRoomDTO>> GetAllAsync()
        {
            var _classes = await _repository.GetAllClassRoomsAsync();

            var classRoomDtos = _classes.Select(classRoom => new ClassRoomDTO
            {
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

        public async Task<bool> UpdateAsync(int id, ClassRoomUpdateDto request)
        {
            var classRoom = await _repository.GetClassRoomByIdAsync(id);
            if (classRoom == null) return false;

            // Cập nhật dữ liệu từ DTO sang entity
            _mapper.Map(request, classRoom);
            return await _repository.UpdateClassRoomAsync(classRoom);
        }
    }
}
