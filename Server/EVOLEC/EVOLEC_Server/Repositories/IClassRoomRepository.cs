﻿using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models;

namespace EVOLEC_Server.Repositories
{
    public interface IClassRoomRepository
    {
        Task<ClassRoom?> GetClassRoomByIdAsync(int id);
        Task<IEnumerable<ClassRoom>> GetAllClassRoomsAsync();
        Task<ClassRoom> AddClassRoomAsync(ClassRoom classRoom);
        Task<int> UpdateClassRoomAsync(ClassRoom classRoom);
        Task<bool> DeleteClassRoomAsync(int id);
        Task<List<ApplicationUser>> GetStudentsByClassIdAsync(int classId);
    }
}
