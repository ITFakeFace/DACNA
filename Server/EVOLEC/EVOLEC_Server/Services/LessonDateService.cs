using AutoMapper;
using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models;
using EVOLEC_Server.Repositories;
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
            _lessonDateRepository   = lessonDateRepository;
            _lessonOffDateService   = lessonOffDateService;
            _offDateService         = offDateService;
            _lessonService          = lessonService;
            _mapper                 = mapper;
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
        public async void AddLessonDatesToClassRoom(ClassRoom addedClassroom, DateOnly? startDate, int? shift)
        {
            List<LessonDate> lessonDates = new List<LessonDate>();
            lessonDates = await _lessonDateRepository.AddLessonDateByClassRoom(addedClassroom)!;
            lessonDates = await _lessonDateRepository.HandleLessonDateOff(lessonDates, (int)addedClassroom.Shift!);

            throw new NotImplementedException();
        }

        private async Task<List<LessonDate>> AddDateToLessonDate(ClassRoom classRoom, List<LessonDateCreateDto> lessonDateDtos,int lessonNumber)
        {
            List<DateOnly> listDates = ShiftSchedule.GetDateFromShift((DateOnly)classRoom.StartDate!, (int)classRoom.Shift!, lessonNumber);
            List<LessonDate> listLessonDates = new List<LessonDate>();
            for (int i = 0; i< listDates.Count; i++)
            {
                var lessonDate = new LessonDateCreateDto
                {
                    ClassRoomId = classRoom.Id,
                    Date = listDates[i],
                    StartTime = ShiftSchedule.GetShiftById((int)classRoom.Shift!).FromTime,
                    EndTime = ShiftSchedule.GetShiftById((int)classRoom.Shift!).ToTime,
                };
                lessonDateDtos.Add(lessonDate);
            }

            var offDates = await _offDateService.GetAllOffDatesAsync();
            List<OffDateDto> _allOffDates = offDates.ToList();

            for (int i = 0; i < listDates.Count; i++)
            {
                foreach (var offDate in _allOffDates.Where(o => o.Status == 1))
                {

                    if (listDates[i] >= offDate.FromDate && listDates[i] <= offDate.ToDate)
                    {
                        // Xóa ngày trùng
                        listDates.RemoveAt(i);
                        // Thêm ngày mới hợp lệ
                        var newDate = ShiftSchedule.GetDateFromShift(listDates.Last(), (int)classRoom.Shift!, 1)[0];
                        listDates.Add(newDate);
                        break;
                    }
                }
            }
            throw new NotImplementedException();
        }

    }
}
