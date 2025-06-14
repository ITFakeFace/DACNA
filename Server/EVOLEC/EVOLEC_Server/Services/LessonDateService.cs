using AutoMapper;
using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models;
using EVOLEC_Server.Repositories;
using Microsoft.IdentityModel.Tokens;
using System.CodeDom.Compiler;

namespace EVOLEC_Server.Services
{
    public class LessonDateService : ILessonDateService
    {
        private readonly ILessonDateRepository _lessonDateRepository;
        private readonly ILessonOffDateService _lessonOffDateService;
        private readonly IOffDateService _offDateService;
        private readonly ILessonService _lessonService;
        private readonly IMapper _mapper;

        public LessonDateService(
                ILessonDateRepository lessonDateRepository,
                ILessonOffDateService lessonOffDateService,
                IOffDateService offDateService,
                ILessonService lessonService,
                IMapper mapper)
        {
            _lessonDateRepository = lessonDateRepository;
            _lessonOffDateService = lessonOffDateService;
            _offDateService = offDateService;
            _lessonService = lessonService;
            _mapper = mapper;
        }

        public async Task<LessonDateDto> GetLessonDateByIdAsync(int id)
        {
            var lessonDate = await _lessonDateRepository.GetLessonDateByIdAsync(id);
            if (lessonDate == null) return null;

            var lessonDateDto = new LessonDateDto
            {
                Id = id,
                Teacher = _mapper.Map<ShortInformationTeacher>(lessonDate.Teacher),
                ClassRoom = _mapper.Map<ClassRoomDTO>(lessonDate.ClassRoom),
                Lesson = _mapper.Map<LessonDto>(lessonDate.Lesson),
                Date = lessonDate.Date,
                StartTime = lessonDate.StartTime,
                EndTime = lessonDate.EndTime,
                Note = lessonDate.Note,
            };

            return lessonDateDto;
        }

        public async Task<LessonDateDto> CreateLessonDateAsync(LessonDateCreateDto lessonDateCreateDto)
        {
            try
            {
                //chuyển check date-off lên tầng này ( nếu có ) 

                var lessonDate = _mapper.Map<LessonDate>(lessonDateCreateDto);
                var createdLessonDate = await _lessonDateRepository.AddLessonDateAsync(lessonDate);
                if (createdLessonDate == null)
                {
                    return null!;
                }
                return _mapper.Map<LessonDateDto>(createdLessonDate);

            }
            catch (Exception ex)
            {
                return null!;
            }
        }

        public async Task<int> UpdateLessonDateAsync(int id, LessonDateUpdateDto lessonDateUpdateDto)
        {
            try
            {
                var lessonDate = await _lessonDateRepository.GetLessonDateByIdAsync(id);
                if (lessonDate == null) return -2;
                _mapper.Map(lessonDateUpdateDto, lessonDate);
                return await _lessonDateRepository.UpdateLessonDateAsync(lessonDate);
            }
            catch (Exception ex)
            {
                return -1;
            }
        }

        public async Task<bool> DeleteLessonDateAsync(int id)
        {
            return await _lessonDateRepository.DeleteLessonDateAsync(id);
        }

        public async Task<IEnumerable<LessonDateDto>> GetLessonDatesByClassIdAsync(int classId)
        {
            var lessonDates = await _lessonDateRepository.GetLessonDatesAsyncByClassId(classId);

            var lessonDateDtos = lessonDates.Select(lessonDate => new LessonDateDto
            {
                Id = lessonDate.Id,
                Teacher = _mapper.Map<ShortInformationTeacher>(lessonDate.Teacher),
                ClassRoom = _mapper.Map<ClassRoomDTO>(lessonDate.ClassRoom),
                Lesson = _mapper.Map<LessonDto>(lessonDate.Lesson),
                Date = lessonDate.Date,
                StartTime = lessonDate.StartTime,
                EndTime = lessonDate.EndTime,
                Note = lessonDate.Note,
            }).ToList();

            return lessonDateDtos;
        }
        public async Task<bool> AddLessonDatesToClassRoom(ClassRoom addedClassroom)
        {
            List<LessonDate>? lessonDates = new List<LessonDate>();
            lessonDates = await _lessonDateRepository.AddLessonDateByClassRoom(addedClassroom)!;
            List<LessonDate>? tmplessonDates = await _lessonOffDateService.HandleHolidays(lessonDates);
            if (tmplessonDates == null)
            {
                await _lessonDateRepository.DeleteLessonDatesAsync(lessonDates);
                return false;
            }
            lessonDates = await _lessonDateRepository.AssignTeacherToLessonDateInitFunc(tmplessonDates, (int)addedClassroom.Shift!, lessonDates[0].ClassRoom);
            if (lessonDates.IsNullOrEmpty())
            {
                return false; // Không có lessonDates hợp lệ
            }
            return true;

        }

    }
}
