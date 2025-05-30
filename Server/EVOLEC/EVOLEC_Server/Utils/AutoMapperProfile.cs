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
            CreateMap<ClassRoomUpdateDto, ClassRoom>();
            CreateMap<ClassRoomCreateDTO, ClassRoom>();
            CreateMap<ApplicationUser, ShortInformationTeacher>();

            // Entity -> DTO
            CreateMap<LessonOffDate, LessonOffDateDto>();

            // DTO -> Entity
            CreateMap<LessonOffDateCreateDto, LessonOffDate>();
            CreateMap<LessonOffDateUpdateDto, LessonOffDate>();

            CreateMap<LessonDate, LessonDateDto>();
            CreateMap<LessonDateCreateDto, LessonDate>();
            CreateMap<LessonDateUpdateDto, LessonDate>();

            CreateMap<OffDate, OffDateDto>();
            CreateMap<OffDateCreateDto, OffDate>();
            CreateMap<OffDateUpdateDto, OffDate>();

            CreateMap<Room, RoomDto>();
            CreateMap<RoomCreateDto, Room>();
            CreateMap<RoomUpdateDto, Room>();
        }
    }
}
