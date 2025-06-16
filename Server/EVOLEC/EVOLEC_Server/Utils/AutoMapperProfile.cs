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
            CreateMap<ApplicationUser, UserDto>();

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


            CreateMap<EnrollmentDto, Enrollment>();
            CreateMap<EnrollmentCreateDTO, Enrollment>();

            CreateMap<Enrollment, EnrollmentDto>();

            CreateMap<ClassRoom, ClassRoomShortInfomation>();

            CreateMap<LessonOffDate, lessonOffDateClassResp>();

            CreateMap<LessonOffDate, ClassRoomAffectedDto>()
               .ForMember(dest => dest.ClassRoomId, opt => opt.MapFrom(src => src.LessonDate.ClassRoom.Id))
               .ForMember(dest => dest.ClassRoomName, opt => opt.MapFrom(src => src.LessonDate.ClassRoom.Course.Name))
               .ForMember(dest => dest.LessonId, opt => opt.MapFrom(src => src.LessonDate.Id))// NOTE: LessonID is actually LessonDate ID
               .ForMember(dest => dest.Lesson, opt => opt.MapFrom(src => src.LessonDate.Lesson.Name))
               .ForMember(dest => dest.TeacherId, opt => opt.MapFrom(src => src.LessonDate.TeacherId))
               .ForMember(dest => dest.Teacher, opt => opt.MapFrom(src => src.LessonDate.Teacher.UserName))
               .ForMember(dest => dest.Date, opt => opt.MapFrom(src => src.LessonDate.Date))
               .ForMember(dest => dest.StartTime, opt => opt.MapFrom(src => src.LessonDate.StartTime))
               .ForMember(dest => dest.EndTime, opt => opt.MapFrom(src => src.LessonDate.EndTime))
               .ForMember(dest => dest.RoomId, opt => opt.MapFrom(src => src.LessonDate.RoomId))
               .ForMember(dest => dest.RoomName, opt => opt.MapFrom(src => src.LessonDate.Room.Name));
        }
    }
}
