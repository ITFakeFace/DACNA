using AutoMapper;
using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models;
using EVOLEC_Server.Repositories;
using System.Collections.Generic;

namespace EVOLEC_Server.Services
{
    public class LessonOffDateService : ILessonOffDateService
    {
        private readonly ILessonOffDateRepository _repository;
        private readonly IMapper _mapper;

        public LessonOffDateService(ILessonOffDateRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<LessonOffDateDto> GetAsync(int lessonDateId, int offDateId)
        {
            var entity = await _repository.GetAsync(lessonDateId, offDateId);
            return entity == null ? null : _mapper.Map<LessonOffDateDto>(entity);
        }

        public async Task<IEnumerable<LessonOffDateDto>> GetAllAsync()
        {
            var list = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<LessonOffDateDto>>(list);
        }

        public async Task<IEnumerable<LessonOffDateDto>> GetAllByOffDateIdAsync(int offDateId)
        {
            var list = await _repository.GetAllByOffDateIdAsync(offDateId);
            return _mapper.Map<IEnumerable<LessonOffDateDto>>(list);
        }

        public async Task<LessonOffDateDto> CreateAsync(LessonOffDateCreateDto createDto)
        {
            var entity = _mapper.Map<LessonOffDate>(createDto);
            var result = await _repository.AddAsync(entity);
            return _mapper.Map<LessonOffDateDto>(result);
        }

        public async Task<bool> UpdateAsync(LessonOffDateUpdateDto updateDto)
        {
            var existing = await _repository.GetAsync(updateDto.LessonDateId, updateDto.OffDateId);
            if (existing == null) return false;

            // Cập nhật InitDate
            existing.InitDate = updateDto.InitDate;

            return await _repository.UpdateAsync(existing);
        }

        public async Task<bool> DeleteAsync(int lessonDateId, int offDateId)
        {
            return await _repository.DeleteAsync(lessonDateId, offDateId);
        }
    }
}
