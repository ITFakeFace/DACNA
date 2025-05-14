using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models;

namespace EVOLEC_Server.Services
{
    public interface IClassRoomService
    {

        Task<IEnumerable<ClassRoomDTO>> GetAllAsync();
        Task<ClassRoomDTO?> GetByIdAsync(int id);
        Task<int> CreateAsync(ClassRoomCreateDTO request);
        Task<int> UpdateAsync(int id, ClassRoomUpdateDto request);
        //Task<bool> AddStudentAsync(Guid classId, Guid studentId);
        //Task<bool> RemoveStudentAsync(Guid classId, Guid studentId);
        //Task<IEnumerable<StudentDto>> GetStudentsAsync(Guid classId);
    }

}
