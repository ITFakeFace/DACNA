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

        public async Task<ClassRoom> GetClassRoomByIdAsync(int id)
        {
            return await _ctx.ClassRooms.FindAsync(id);
        }

        public async Task<IEnumerable<ClassRoom>> GetAllClassRoomsAsync()
        {
            return await _ctx.ClassRooms.ToListAsync();
        }

        public async Task<ClassRoom> AddClassRoomAsync(ClassRoom classRoom)
        {
            _ctx.ClassRooms.Add(classRoom);
            await _ctx.SaveChangesAsync();
            return classRoom;
        }

        public async Task<bool> UpdateClassRoomAsync(ClassRoom classRoom)
        {
            _ctx.ClassRooms.Update(classRoom);
            return await _ctx.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteClassRoomAsync(int id)
        {
            var classRoom = await GetClassRoomByIdAsync(id);
            if (classRoom == null) return false;

            _ctx.ClassRooms.Remove(classRoom);
            return await _ctx.SaveChangesAsync() > 0;
        }
    }
}
