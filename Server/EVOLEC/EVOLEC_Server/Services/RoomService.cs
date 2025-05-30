using AutoMapper;
using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models;
using EVOLEC_Server.Repositories;

namespace EVOLEC_Server.Services
{
    public class RoomService : IRoomService
    {
        private readonly IRoomRepository _roomRepository;
        private readonly IMapper _mapper;

        public RoomService(IRoomRepository roomRepository, IMapper mapper)
        {
            _roomRepository = roomRepository;
            _mapper = mapper;
        }

        public async Task<RoomDto?> GetRoomByIdAsync(int id)
        {
            var room = await _roomRepository.GetRoomByIdAsync(id);
            return room == null ? null : _mapper.Map<RoomDto>(room);
        }

        public async Task<IEnumerable<RoomDto>> GetAllRoomsAsync()
        {
            var rooms = await _roomRepository.GetAllRoomsAsync();
            return _mapper.Map<IEnumerable<RoomDto>>(rooms);
        }

        public async Task<RoomDto> CreateRoomAsync(RoomCreateDto dto)
        {
            var room = _mapper.Map<Room>(dto);
            var created = await _roomRepository.AddRoomAsync(room);
            return _mapper.Map<RoomDto>(created);
        }

        public async Task<bool> UpdateRoomAsync(int id, RoomUpdateDto dto)
        {
            var room = await _roomRepository.GetRoomByIdAsync(id);
            if (room == null) return false;

            _mapper.Map(dto, room);
            return await _roomRepository.UpdateRoomAsync(room);
        }

        public async Task<bool> DeleteRoomAsync(int id)
        {
            return await _roomRepository.DeleteRoomAsync(id);
        }

        public async Task<bool> IsRoomNameUniqueAsync(string name, int? excludeId = null)
        {
            return await _roomRepository.IsRoomNameUniqueAsync(name, excludeId);
        }
    }
}
