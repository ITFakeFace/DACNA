using EVOLEC_Server.Dtos;
using EVOLEC_Server.DTOs.Lesson;
using EVOLEC_Server.Models;

namespace EVOLEC_Server.Services
{
    public interface ILessonService
    {
        Task<IEnumerable<LessonDto>> GetAllLessonsAsync();
        Task<LessonDto> GetLessonByIdAsync(int id);
        Task<IEnumerable<LessonDto>> GetLessonByCourseIdAsync(int courseId);
        Task<LessonDto> CreateLessonAsync(LessonCreateDto dto);
        Task<bool> UpdateLessonAsync(int id, LessonUpdateDto dto);
        Task<bool> DeleteLessonAsync(int id);
    }
}
