using EVOLEC_Server.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace EVOLEC_Server.Repositories
{
    public class RoomRepository : IRoomRepository
    {
        private readonly EVOLECDbContext _ctx;

        public RoomRepository(EVOLECDbContext context)
        {
            _ctx = context;
        }

        public async Task<Room?> GetRoomByIdAsync(int id)
        {
            return await _ctx.Rooms
                .Include(r => r.ClassRooms)
                .Include(r => r.LessonDates)
                .FirstOrDefaultAsync(r => r.ID == id);
        }

        public async Task<IEnumerable<Room>> GetAllRoomsAsync()
        {
            return await _ctx.Rooms
                .Include(r => r.ClassRooms)
                .Include(r => r.LessonDates)
                .ToListAsync();
        }

        public async Task<Room> AddRoomAsync(Room room)
        {
            _ctx.Rooms.Add(room);
            await _ctx.SaveChangesAsync();
            return room;
        }

        public async Task<bool> UpdateRoomAsync(Room room)
        {
            _ctx.Rooms.Update(room);
            return await _ctx.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteRoomAsync(int id)
        {
            var room = await GetRoomByIdAsync(id);
            if (room == null) return false;

            _ctx.Rooms.Remove(room);
            return await _ctx.SaveChangesAsync() > 0;
        }

        public async Task<bool> IsRoomNameUniqueAsync(string name, int? excludeId = null)
        {
            return !await _ctx.Rooms
                .AnyAsync(r => r.Name == name && (excludeId == null || r.ID != excludeId));
        }
    }
}
