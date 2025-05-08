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

        public async Task<int> CreateAsync(ClassRoomDTO dto)
        {
            var entity = _mapper.Map<ClassRoom>(dto);
            return await _repository.AddClassRoomAsync(entity);
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
            var responseRaw = new 
            {
                Id = _class.Id,
                Name = _class.Course.Name,
                Teachers = new List<object>()
                {
                    _class.Teacher1 != null 
                                        ? new {Teacher1Id = _class.Teacher1Id,Teacher1Name = _class.Teacher1.Fullname}
                                        : null!,
                    _class.Teacher2 != null 
                                        ? new {Teacher1Id = _class.Teacher2Id,Teacher1Name = _class.Teacher2.Fullname}
                                        : null!,
                },
                lessonDate = _class.LessonDates,

            };

            if (_class == null) { return null; }
            return _mapper.Map<ClassRoomDTO>(_class);
        }


    }
}
