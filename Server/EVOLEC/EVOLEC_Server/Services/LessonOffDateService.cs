using AutoMapper;
using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models;
using EVOLEC_Server.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EVOLEC_Server.Services
{
    public class LessonOffDateService : ILessonOffDateService
    {
        private readonly ILessonOffDateRepository _repository;
        private readonly IOffDateRepository _offDateRepository;
        private readonly IMapper _mapper;

        public LessonOffDateService(ILessonOffDateRepository repository, IOffDateRepository offDateRepository, IMapper mapper)
        {
            _repository = repository;
            _offDateRepository = offDateRepository;
            _mapper = mapper;
        }

        public async Task<LessonOffDateDto> GetAsync(int lessonDateId, int offDateId)
        {
            var entity = await _repository.GetAsync(lessonDateId, offDateId);
            return entity == null ? null : _mapper.Map<LessonOffDateDto>(entity);
        }

        public async Task<IEnumerable<LessonOffDateDto>> GetAllAsync()
        {
            var list = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<LessonOffDateDto>>(list);
        }

        public async Task<lessonOffDateClassResp> GetAllByOffDateIdAsync(int offDateId)
        {
            var list = await _repository.GetAllByOffDateIdAsync(offDateId);
            List<LessonOffDate> lessonOffDates = list.ToList();
            List<ClassRoomDTO> classRoomDTOs = new List<ClassRoomDTO>();
            OffDateDto offDateDto = _mapper.Map<OffDateDto>(lessonOffDates[0].OffDate);

            foreach (var item in lessonOffDates)
            {
                ClassRoomDTO classRoomDTO = _mapper.Map<ClassRoomDTO>(item.LessonDate.ClassRoom);
                if (!classRoomDTOs.Any(c => c.Id == classRoomDTO.Id))
                {
                    classRoomDTOs.Add(classRoomDTO);
                }

            }
            return new lessonOffDateClassResp() 
            {
                OffDate = offDateDto,
                ClassRooms = classRoomDTOs
            };
        }

        public async Task<LessonOffDateDto> CreateAsync(LessonOffDateCreateDto createDto)
        {
            var entity = _mapper.Map<LessonOffDate>(createDto);
            var result = await _repository.AddAsync(entity);
            return _mapper.Map<LessonOffDateDto>(result);
        }

        public async Task<bool> UpdateAsync(LessonOffDateUpdateDto updateDto)
        {
            var existing = await _repository.GetAsync(updateDto.LessonDateId, updateDto.OffDateId);
            if (existing == null) return false;

            // Cập nhật InitDate
            existing.InitDate = updateDto.InitDate;

            return await _repository.UpdateAsync(existing);
        }

        public async Task<bool> DeleteAsync(int lessonDateId, int offDateId)
        {
            var existing = await _repository.GetAsync(lessonDateId, offDateId);
            if (existing == null) return false;
            return await _repository.DeleteAsync(lessonDateId, offDateId);
        }

        public async Task<List<LessonDate>?> HandleHolidays(List<LessonDate> lessonDates)
        {
            if (lessonDates == null)
                return null;

            DateOnly minDate = (DateOnly)lessonDates.Min(ld => ld.Date)!;
            DateOnly maxDate = (DateOnly)lessonDates.Max(ld => ld.Date)!;

            // Lấy các ngày nghỉ trong khoảng ngày học
            var holidays = await _offDateRepository.GetHolidaysInRangeAsync(minDate, maxDate);

            for (int i = 0; i < lessonDates.Count; i++)
            {
                var lessonDate = lessonDates[i];

                foreach (var holiday in holidays)
                {
                    // Nếu ngày học rơi vào ngày nghỉ
                    while (lessonDate.Date >= holiday.FromDate && lessonDate.Date <= holiday.ToDate)
                    {
                        // Dời sang ngày học cuối cùng (giống logic gốc)
                        DateOnly lastLessonDate = (DateOnly)lessonDates[lessonDates.Count - 1].Date!;

                        LessonOffDate lessonOffDate = new LessonOffDate()
                        {
                            LessonDateId = lessonDate.Id,
                            OffDateId = holiday.Id,
                            InitDate = (DateOnly)lessonDate.Date!,
                        };
                        lessonDate.Date = ShiftSchedule.GetDateFromShift(((DateOnly)lessonDates.Last().Date!).AddDays(1), (int)lessonDate.ClassRoom.Shift!, 1)[0];
                        await _repository.AddAsync(lessonOffDate);
                        break;
                    }
                }
            }
            // Bubble sort theo DateOnly tăng dần
            for (int i = 0; i < lessonDates.Count - 1; i++)
            {
                for (int j = 0; j < lessonDates.Count - i - 1; j++)
                {
                    if (lessonDates[j].Date > lessonDates[j + 1].Date)
                    {
                        // Hoán đổi
                        var temp = lessonDates[j].Date;
                        lessonDates[j].Date = lessonDates[j + 1].Date;
                        lessonDates[j + 1].Date = temp;
                    }
                }
            }
            await _repository.UpdateInRangeAsync(lessonDates);

            return lessonDates;
        }

    }
}
