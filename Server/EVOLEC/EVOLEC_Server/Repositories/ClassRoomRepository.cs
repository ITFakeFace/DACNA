using EVOLEC_Server.Models;
using EVOLEC_Server.Utils;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

namespace EVOLEC_Server.Repositories
{
    public class ClassRoomRepository : IClassRoomRepository
    {
        private readonly EVOLECDbContext _ctx;
        private readonly ILessonDateRepository _lessonDateRepository;

        public ClassRoomRepository(EVOLECDbContext context, ILessonDateRepository lessonDateRepository)
        {
            _ctx = context;
            _lessonDateRepository = lessonDateRepository;
        }

        public async Task<ClassRoom?> GetClassRoomByIdAsync(int id)
        {
            return await _ctx.ClassRooms
                             .Where(x => x.Id == id) // Lọc lớp học với ID tương ứng
                             .Include(x => x.Teacher1) // Nạp Teacher1
                             .Include(x => x.Teacher2) // Nạp Teacher2
                             .Include(x => x.LessonDates)
                             .Include(x => x.Course)
                             .FirstOrDefaultAsync(); // Lấy kết quả đầu tiên (hoặc null nếu không tìm thấy)

        }

        public async Task<IEnumerable<ClassRoom>> GetAllClassRoomsAsync()
        {
            return await _ctx.ClassRooms
                             .Include(x => x.Teacher1)
                             .Include(x => x.Teacher2)
                             .Include(x => x.Creator)
                             .Include(x => x.Course)
                             .ToListAsync();
        }



        public async Task<ClassRoom> AddClassRoomAsync(ClassRoom classRoom)
        {
            int result = 0;
            var course = await _ctx.Courses
                .Include(c => c.Lessons)
                .FirstOrDefaultAsync(c => c.Id == classRoom.CourseId);

            if (course == null)
            {
                return null!;
            }
            _ctx.ClassRooms.Add(classRoom);
            await _ctx.SaveChangesAsync();
            return classRoom;

        }
        public async Task<int> UpdateClassRoomAsync(ClassRoom classRoom)
        {
            // Cập nhật thông tin lớp học
            _ctx.ClassRooms.Update(classRoom);
            // Xóa hết LessonDate cũ
            var oldLessonDates = await _ctx.LessonDates
                .Where(ld => ld.ClassRoomId == classRoom.Id)
                .ToListAsync();

            _ctx.LessonDates.RemoveRange(oldLessonDates);
            return await _ctx.SaveChangesAsync();
        }


        public Task<bool> DeleteClassRoomAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<List<ApplicationUser>> GetStudentsByClassIdAsync(int classId)
        {
            var students = await _ctx.Enrollments
                .Include(e => e.Student)
                .Where(e => e.ClassRoomId == classId)
                .Select(e => e.Student)
                .ToListAsync();

            return students;
        }
    }
}
