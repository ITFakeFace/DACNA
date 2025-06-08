using AutoMapper;
using EVOLEC_Server.Dtos;
using EVOLEC_Server.DTOs.Lesson;
using EVOLEC_Server.Models;
using EVOLEC_Server.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace EVOLEC_Server.Services
{
    public class OffDateService : IOffDateService
    {
        private readonly IOffDateRepository _offDateRepository;
        private readonly ILessonOffDateRepository _lessonOffDateRepository;
        private readonly IClassRoomRepository _classRoomRepository;
        private readonly IMapper _mapper;
        public OffDateService(IOffDateRepository offDateRepository, IMapper mapper, ILessonOffDateRepository lessonOffDateRepository, IClassRoomRepository classRoomRepository)
        {
            _offDateRepository = offDateRepository;
            _mapper = mapper;
            _lessonOffDateRepository = lessonOffDateRepository;
            _classRoomRepository = classRoomRepository;
        }
        public async Task<IEnumerable<OffDateDto>> GetAllOffDatesAsync()
        {
            var list = await _offDateRepository.GetAllOffDatesAsync();
            return _mapper.Map<IEnumerable<OffDateDto>>(list);
        }

        public async Task<OffDateDto> GetOffDateByIdAsync(int id)
        {
            var offDate = await _offDateRepository.GetOffDateByIdAsync(id);
            return _mapper.Map<OffDateDto>(offDate);
        }

        public async Task<OffDateDto> CreateOffDateAsync(OffDateCreateDto dto)
        {
            var offDate = _mapper.Map<OffDate>(dto);

            var created = await _offDateRepository.AddOffDateAsync(offDate);
            if (created == null)
                throw new Exception("Failed to create OffDate.");

            return _mapper.Map<OffDateDto>(created);
        }

        public async Task<bool> DeleteOffDateAsync(int id)
        {
            var existing = await _offDateRepository.GetOffDateByIdAsync(id);
            if (existing == null)
                return false;

            return await _offDateRepository.DeleteOffDateAsync(id);
        }

        public async Task<bool> UpdateOffDateAsync(int id, OffDateUpdateDto dto)
        {
            var existing = await _offDateRepository.GetOffDateByIdAsync(id);
            if (existing == null)
                return false;

            _mapper.Map(dto, existing); // Map dto vào entity hiện có
            return await _offDateRepository.UpdateOffDateAsync(existing);
        }

        public async Task<List<ClassRoomDTO>> GetAffectedClassByOffDateId(int id)
        {
            var lessonOffDates = await _lessonOffDateRepository.GetAllByOffDateIdAsync(id);
            HashSet<int> classSet = new HashSet<int>();
            foreach (var lessonDate in lessonOffDates)
            {
                classSet.Add(lessonDate.LessonDate.ClassRoomId);
            }
            List<ClassRoomDTO> result = new List<ClassRoomDTO>();
            foreach (var classId in classSet)
            {
                result.Add(_mapper.Map<ClassRoomDTO>(await _classRoomRepository.GetClassRoomByIdAsync(classId)));
            }
            return result;
        }
        public async Task<List<OffDate>> GetOffHolidaysInRangeAsync(DateOnly minDate, DateOnly maxDate)
        {
            return await _offDateRepository.GetHolidaysInRangeAsync(minDate, maxDate);
        }

        public async Task<List<OffDate>> GetTeacherHolidaysInRangeAsync(DateOnly minDate, DateOnly maxDate, string TeacherID)
        {
            return await _offDateRepository.GetTeacherOffDatesInRangeAsync(minDate, maxDate, TeacherID);
        }
    }
}
