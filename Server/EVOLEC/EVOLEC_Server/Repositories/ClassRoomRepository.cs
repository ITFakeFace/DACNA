using EVOLEC_Server.Models;
using Microsoft.EntityFrameworkCore;

namespace EVOLEC_Server.Repositories
{
    public class ClassRoomRepository : IClassRoomRepository
    {
        private readonly EVOLECDbContext _ctx;

        public ClassRoomRepository(EVOLECDbContext context)
        {
            _ctx = context;
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
                             .Include(x=>x.Teacher1)
                             .Include(x=>x.Teacher2)
                             .Include(x=>x.Creator)
                             .Include(x=>x.Course)
                             .ToListAsync();
        }


        public async Task<int> AddClassRoomAsync(ClassRoom classRoom)
        {
            try
            {
                _ctx.ClassRooms.Add(classRoom);
                await _ctx.SaveChangesAsync();
                return classRoom.Id; 
            }
            catch
            {
                return -1; 
            }
        }




        public async Task<bool> UpdateClassRoomAsync(ClassRoom classRoom)
        {
            _ctx.ClassRooms.Update(classRoom);
            return await _ctx.SaveChangesAsync() > 0;
        }

        public Task<bool> DeleteClassRoomAsync(int id)
        {
            throw new NotImplementedException();
        }
    }
}
