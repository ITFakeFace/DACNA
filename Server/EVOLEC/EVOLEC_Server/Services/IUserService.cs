﻿using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models;

namespace EVOLEC_Server.Services
{
    public interface IUserService
    {
        Task<List<ApplicationUser>> FindAll();
        Task<ApplicationUser?> FindById(string id);
        Task<List<ApplicationUser?>> GetTeachersAsync();
        Task<List<ApplicationUser?>> GetStudentsAsync();
        Task<bool> Create(UserCreateDto model);
        Task<bool> Update(string userId, UserUpdateDto model);
        Task<bool> Delete(string userId);
        Task<bool> ToggleStatus(string userId, bool status);
        Task<List<LessonDateScheduleDto>> GetStudyingLessonDatesAsync(string studentId);
        Task<List<LessonDateScheduleDto>> GetTeachingLessonDatesAsync(string teacherId);
        Task<IEnumerable<ClassRoomDTO>> GetStudyClassRoom(string studentId);
        Task<IEnumerable<ClassRoomDTO>> GetTeachClassRoom(string teacherId);
    }
}
