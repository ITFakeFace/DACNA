using AutoMapper;
using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models;
using EVOLEC_Server.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EVOLEC_Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly IRoomService _roomService;
        private readonly IMapper _mapper;

        public RoomController(IRoomService roomService, IMapper mapper)
        {
            _roomService = roomService;
            _mapper = mapper;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoomById(int id)
        {
            var room = await _roomService.GetRoomByIdAsync(id);
            if (room == null)
                return NotFound(new ResponseEntity<string>
                {
                    Status = false,
                    ResponseCode = 404,
                    StatusMessage = "Room not found",
                    Data = null,
                });

            return Ok(new ResponseEntity<RoomDto>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "Success",
                Data = room,
            });
        }

        [HttpGet]
        public async Task<IActionResult> GetAllRooms()
        {
            var rooms = await _roomService.GetAllRoomsAsync();
            return Ok(new ResponseEntity<IEnumerable<RoomDto>>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "Success",
                Data = rooms,
            });
        }

        [HttpPost]
        public async Task<IActionResult> CreateRoom([FromBody] RoomCreateDto dto)
        {
            var room = await _roomService.CreateRoomAsync(dto);
            return CreatedAtAction(nameof(GetRoomById), new { id = room.ID }, new ResponseEntity<RoomDto>
            {
                Status = true,
                ResponseCode = 201,
                StatusMessage = "Room created successfully",
                Data = room,
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoom(int id, [FromBody] RoomUpdateDto dto)
        {
            var result = await _roomService.UpdateRoomAsync(id, dto);
            if (!result)
                return BadRequest(new ResponseEntity<string>
                {
                    Status = false,
                    ResponseCode = 400,
                    StatusMessage = "Room update failed",
                    Data = null,
                });

            return Ok(new ResponseEntity<string>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "Room updated successfully",
                Data = null,
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            var result = await _roomService.DeleteRoomAsync(id);
            if (!result)
                return NotFound(new ResponseEntity<string>
                {
                    Status = false,
                    ResponseCode = 404,
                    StatusMessage = "Room not found",
                    Data = null,
                });

            return Ok(new ResponseEntity<string>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "Room deleted successfully",
                Data = null,
            });
        }

        [HttpGet("check-name")]
        public async Task<IActionResult> IsRoomNameUnique([FromQuery] string name, [FromQuery] int? excludeId = null)
        {
            var isUnique = await _roomService.IsRoomNameUniqueAsync(name, excludeId);
            return Ok(new ResponseEntity<bool>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = isUnique ? "Room name is unique" : "Room name already exists",
                Data = isUnique,
            });
        }

        [HttpGet("get-schedule/{id}")]
        public async Task<IActionResult> GetRoomSchedule(int id)
        {
            var result = await _roomService.GetRoomScheduleAsync(id);
            return Ok(new ResponseEntity<IEnumerable<LessonDateScheduleDto>>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "Success",
                Data = result,
            });
        }
    }
}
