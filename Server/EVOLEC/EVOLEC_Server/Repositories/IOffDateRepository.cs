using EVOLEC_Server.Models;

namespace EVOLEC_Server.Repositories
{
    public interface IOffDateRepository
    {
        Task<OffDate> GetOffDateByIdAsync(int id);
        Task<IEnumerable<OffDate>> GetAllOffDatesAsync();
        Task<OffDate> AddOffDateAsync(OffDate offDate);
        Task<bool> UpdateOffDateAsync(OffDate offDate);
        Task<bool> DeleteOffDateAsync(int id);
    }
}
