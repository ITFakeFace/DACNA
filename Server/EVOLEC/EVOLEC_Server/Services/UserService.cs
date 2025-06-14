using EVOLEC_Server.CustomException;
using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models;
using EVOLEC_Server.Repositories;
using Microsoft.AspNetCore.Identity;

namespace EVOLEC_Server.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly UserManager<ApplicationUser> _userManager;

        public UserService(IUserRepository userRepository, UserManager<ApplicationUser> userManager)
        {
            _userRepository = userRepository;
            _userManager = userManager;
        }

        // Tạo người dùng mới
        public async Task<bool> Create(UserCreateDto model)
        {
            return await _userRepository.Create(model);
        }

        // Xóa người dùng
        public async Task<bool> Delete(string userId)
        {
            return await _userRepository.Delete(userId);
        }

        // Lấy tất cả người dùng
        public async Task<List<ApplicationUser>> FindAll()
        {
            return await _userRepository.FindAll();
        }

        // Tìm người dùng theo Id
        public async Task<ApplicationUser?> FindById(string id)
        {
            return await _userRepository.FindById(id);
        }

        // Cập nhật thông tin người dùng
        public async Task<bool> Update(string userId, UserUpdateDto model)
        {
            return await _userRepository.Update(userId, model);
        }

        // Thay đổi trạng thái (ban/unban) của người dùng
        public async Task<bool> ToggleStatus(string userId, bool isEnable)
        {
            // Kiểm tra xem người dùng có phải là admin không, không thể ban admin
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;
            var roles = await _userManager.GetRolesAsync(user);
            if (roles.Contains("ADMIN"))
            {
                throw new AdminBanException("Cannot ban an admin user.");
            }

            return await _userRepository.ToggleStatus(userId, isEnable);
        }

        public async Task<List<ApplicationUser>> GetTeachersAsync()
        {
            // Lấy user có role "teacher"
            return await _userRepository.GetUsersByRoleAsync("teacher");
        }
        public async Task<List<ApplicationUser>> GetStudentsAsync()
        {
            // Lấy user có role "student"
            return await _userRepository.GetUsersByRoleAsync("student");
        }

        public async Task<List<DateOnly>> GetTeacherTeachDayAsync(string id)
        {
            var teachers = await _userRepository.GetUsersByRoleAsync("TEACHER");
            var teacherList = teachers.Where(teacher => teacher.Id == id).ToList();
            var resultTeacher = teacherList.Count > 0 ? teacherList[0] : null;
            if (resultTeacher == null)
                return new List<DateOnly>();

            var result = new List<DateOnly>();
            foreach (var lessonDate in resultTeacher.TeachedDates)
            {
                if (lessonDate.Date != null)
                    result.Add((DateOnly)lessonDate.Date);
            }
            return result;
        }

        public async Task<List<LessonDateScheduleDto>> GetStudyingLessonDatesAsync(string studentId)
        {
            var lessonDates = await _userRepository.GetStudyingLessonDate(studentId);

            return lessonDates.Select(ld => new LessonDateScheduleDto
            {
                Id = ld.Id,
                TeacherId = ld.TeacherId,
                TeacherName = ld.Teacher?.Fullname,
                ClassRoomId = ld.ClassRoomId,
                LessonId = ld.LessonId,
                LessonName = ld.Lesson?.Name,
                Note = ld.Note,
                Start = CombineDateTime(ld.Date, ld.StartTime),
                End = CombineDateTime(ld.Date, ld.EndTime)
            }).ToList();
        }

        public async Task<List<LessonDateScheduleDto>> GetTeachingLessonDatesAsync(string teacherId)
        {
            var lessonDates = await _userRepository.GetTeachingLessonDate(teacherId);

            return lessonDates.Select(ld => new LessonDateScheduleDto
            {
                Id = ld.Id,
                TeacherId = ld.TeacherId,
                TeacherName = ld.Teacher?.Fullname,
                ClassRoomId = ld.ClassRoomId,
                LessonId = ld.LessonId,
                LessonName = ld.Lesson?.Name,
                Note = ld.Note,
                Start = CombineDateTime(ld.Date, ld.StartTime),
                End = CombineDateTime(ld.Date, ld.EndTime)
            }).ToList();
        }

        private DateTime? CombineDateTime(DateOnly? date, TimeOnly? time)
        {
            if (date.HasValue && time.HasValue)
                return new DateTime(date.Value.Year, date.Value.Month, date.Value.Day, time.Value.Hour, time.Value.Minute, 0);
            return null;
        }
    }
}
