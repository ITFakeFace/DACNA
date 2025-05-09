using AutoMapper;
using EVOLEC_Server.Dtos;
using EVOLEC_Server.DTOs.Lesson;
using EVOLEC_Server.Models;

namespace EVOLEC_Server.Utils
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<CourseCreateDto, Course>();
            CreateMap<CourseUpdateDto, Course>();
            CreateMap<Course, CourseDto>();

            CreateMap<ApplicationUser, ShortInformationUser>();

            CreateMap<Lesson, LessonDto>();
            CreateMap<LessonCreateDto, Lesson>();
            CreateMap<LessonUpdateDto, Lesson>();

            CreateMap<ClassRoomDTO, ClassRoom>();
            CreateMap<ClassRoom, ClassRoomDTO>();
            CreateMap<ClassRoom, ClassRoomCreateDTO>();
            CreateMap<ApplicationUser, ShortInformationTeacher>();
        }
    }
}
