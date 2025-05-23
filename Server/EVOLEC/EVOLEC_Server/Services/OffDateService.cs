using AutoMapper;
using EVOLEC_Server.Dtos;
using EVOLEC_Server.DTOs.Lesson;
using EVOLEC_Server.Models;
using EVOLEC_Server.Repositories;

namespace EVOLEC_Server.Services
{
    public class OffDateService : IOffDateService
    {
        private readonly IOffDateRepository _offDateRepository;
        private readonly IMapper _mapper;
        public OffDateService(IOffDateRepository offDateRepository, IMapper mapper)
        {
            _offDateRepository = offDateRepository;
            _mapper = mapper;
        }
        public async Task<IEnumerable<OffDateDto>> GetAllOffDatesAsync()
        {
            var list = await _offDateRepository.GetAllOffDatesAsync();
            return _mapper.Map<IEnumerable<OffDateDto>>(list);
        }

        public async Task<OffDateDto> GetOffDateByIdAsync(int id)
        {
            var offDate = await _offDateRepository.GetOffDateByIdAsync(id);
            return _mapper.Map<OffDateDto>(offDate);
        }

        public async Task<OffDateDto> CreateOffDateAsync(OffDateCreateDto dto)
        {
            var offDate = _mapper.Map<OffDate>(dto);

            var created = await _offDateRepository.AddOffDateAsync(offDate);
            if (created == null)
                throw new Exception("Failed to create OffDate.");

            return _mapper.Map<OffDateDto>(created);
        }

        public async Task<bool> DeleteOffDateAsync(int id)
        {
            var existing = await _offDateRepository.GetOffDateByIdAsync(id);
            if (existing == null)
                return false;

            return await _offDateRepository.DeleteOffDateAsync(id);
        }

        public async Task<bool> UpdateOffDateAsync(int id, OffDateUpdateDto dto)
        {
            var existing = await _offDateRepository.GetOffDateByIdAsync(id);
            if (existing == null)
                return false;

            _mapper.Map(dto, existing); // Map dto vào entity hiện có
            return await _offDateRepository.UpdateOffDateAsync(existing);
        }
    }
}
