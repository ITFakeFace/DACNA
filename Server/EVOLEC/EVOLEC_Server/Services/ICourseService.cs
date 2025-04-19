using EVOLEC_Server.Dtos;

namespace EVOLEC_Server.Services
{
    public interface ICourseService
    {
        Task<CourseDto> GetCourseByIdAsync(int id);
        Task<IEnumerable<CourseDto>> GetAllCoursesAsync();
        Task<CourseDto> CreateCourseAsync(CourseCreateDto courseCreateDto);
        Task<bool> UpdateCourseAsync(int id, CourseUpdateDto courseUpdateDto);
        Task<bool> DeleteCourseAsync(int id);
    }
}
