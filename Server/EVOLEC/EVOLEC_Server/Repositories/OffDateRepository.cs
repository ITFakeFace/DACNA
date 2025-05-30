using EVOLEC_Server.Models;
using Microsoft.EntityFrameworkCore;

namespace EVOLEC_Server.Repositories
{
    public class OffDateRepository : IOffDateRepository
    {
        private readonly EVOLECDbContext _ctx;

        public OffDateRepository(EVOLECDbContext context)
        {
            _ctx = context;
        }

        public async Task<OffDate> GetOffDateByIdAsync(int id)
        {
            return await _ctx.OffDates.FindAsync(id);
        }

        public async Task<IEnumerable<OffDate>> GetAllOffDatesAsync()
        {
            return await _ctx.OffDates.ToListAsync();
        }

        public async Task<IEnumerable<OffDate>> GetAllRecentOffDatesAsync()
        {
            var now = DateOnly.FromDateTime(DateTime.Now);
            return await _ctx.OffDates.Where(od => od.ToDate >= now).ToListAsync();
        }

        public async Task<OffDate> AddOffDateAsync(OffDate offDate)
        {
            _ctx.OffDates.Add(offDate);
            await _ctx.SaveChangesAsync();
            return offDate;
        }

        public async Task<bool> UpdateOffDateAsync(OffDate offDate)
        {
            _ctx.OffDates.Update(offDate);
            return await _ctx.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteOffDateAsync(int id)
        {
            var offDate = await GetOffDateByIdAsync(id);
            if (offDate == null) return false;

            _ctx.OffDates.Remove(offDate);
            return await _ctx.SaveChangesAsync() > 0;
        }
    }
}
