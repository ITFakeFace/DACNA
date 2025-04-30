using AutoMapper;
using EVOLEC_Server.Dtos;
using EVOLEC_Server.DTOs.Lesson;
using EVOLEC_Server.Models;
using EVOLEC_Server.Repositories;

namespace EVOLEC_Server.Services
{
    public class LessonService : ILessonService
    {
        private readonly ILessonRepository _lessonRepository;
        private readonly IMapper _mapper;

        public LessonService(ILessonRepository lessonRepository, IMapper mapper)
        {
            _lessonRepository = lessonRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<LessonDto>> GetAllLessonsAsync()
        {
            var lessons = await _lessonRepository.GetAllLessonsAsync();
            return _mapper.Map<IEnumerable<LessonDto>>(lessons);
        }

        public async Task<LessonDto> GetLessonByIdAsync(int id)
        {
            var lesson = await _lessonRepository.GetLessonByIdAsync(id);
            return lesson == null ? null : _mapper.Map<LessonDto>(lesson);
        }
        public async Task<IEnumerable<LessonDto>> GetLessonByCourseIdAsync(int courseId)
        {
            var lessons = await _lessonRepository.GetLessonByCourseIdAsync(courseId);
            return _mapper.Map<IEnumerable<LessonDto>>(lessons);
        }

        public async Task<LessonDto> CreateLessonAsync(LessonCreateDto dto)
        {
            var lesson = _mapper.Map<Lesson>(dto);
            var newLesson = await _lessonRepository.AddLessonAsync(lesson);
            return _mapper.Map<LessonDto>(newLesson);
        }

        public async Task<bool> UpdateLessonAsync(int id, LessonUpdateDto dto)
        {
            var existingLesson = await _lessonRepository.GetLessonByIdAsync(id);
            if (existingLesson == null)
                return false;

            _mapper.Map(dto, existingLesson);
            return await _lessonRepository.UpdateLessonAsync(existingLesson);
        }

        public async Task<bool> DeleteLessonAsync(int id)
        {
            return await _lessonRepository.DeleteLessonAsync(id);
        }

    }
}
