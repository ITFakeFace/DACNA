using AutoMapper;
using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models;
using EVOLEC_Server.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace EVOLEC_Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OffDateController : ControllerBase
    {
        private readonly IOffDateService _offDateService;
        private readonly IClassRoomService _classRoomService;
        private readonly ILessonOffDateService _lessonOffDateService;
        private readonly IMapper _mapper;

        public OffDateController(IOffDateService offDateService, IMapper mapper, IClassRoomService classRoomService, ILessonOffDateService lessonOffDateService)
        {
            _offDateService = offDateService;
            _classRoomService = classRoomService;
            _lessonOffDateService = lessonOffDateService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllOffDates()
        {
            var offDates = await _offDateService.GetAllOffDatesAsync();
            return Ok(new ResponseEntity<IEnumerable<OffDateDto>>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "Success",
                Data = offDates
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOffDateById(int id)
        {
            var offDate = await _offDateService.GetOffDateByIdAsync(id);
            if (offDate == null)
            {
                return NotFound(new ResponseEntity<string>
                {
                    Status = false,
                    ResponseCode = 404,
                    StatusMessage = "OffDate not found",
                    Data = null
                });
            }

            return Ok(new ResponseEntity<OffDateDto>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "Success",
                Data = offDate
            });
        }

        [HttpPost]
        public async Task<IActionResult> CreateOffDate([FromBody] OffDateCreateDto dto)
        {
            Console.WriteLine(JsonConvert.SerializeObject(dto));
            var created = await _offDateService.CreateOffDateAsync(dto);
            return CreatedAtAction(nameof(GetOffDateById), new { id = created.Id }, new ResponseEntity<OffDateDto>
            {
                Status = true,
                ResponseCode = 201,
                StatusMessage = "OffDate created successfully",
                Data = created
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOffDate(int id, [FromBody] OffDateUpdateDto dto)
        {
            Console.WriteLine(JsonConvert.SerializeObject(dto));
            var updated = await _offDateService.UpdateOffDateAsync(id, dto);
            if (!updated)
            {
                return BadRequest(new ResponseEntity<string>
                {
                    Status = false,
                    ResponseCode = 400,
                    StatusMessage = "Update failed",
                    Data = null
                });
            }

            return Ok(new ResponseEntity<string>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "OffDate updated successfully",
                Data = null
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOffDate(int id)
        {
            var deleted = await _offDateService.DeleteOffDateAsync(id);
            if (!deleted)
            {
                return NotFound(new ResponseEntity<string>
                {
                    Status = false,
                    ResponseCode = 404,
                    StatusMessage = "OffDate not found or deletion failed",
                    Data = null
                });
            }

            return Ok(new ResponseEntity<string>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "OffDate deleted successfully",
                Data = null
            });
        }

        [HttpPost("add-class")]
        public async Task<IActionResult> AddLessonOffDateByClass([FromBody] OffDateAddByClassDto classList)
        {
            var list = classList.ClassRoomIds;
            while (list.Count > 0)
            {
                var classRoom = await _classRoomService.GetByIdAsync(list[0]);
                list.Remove(list[0]);
            }
            return Ok();
        }

        [HttpGet("get-affected-class/{id}")]
        public async Task<IActionResult> GetAffectedClassByOffDateId(int id)
        {
            return Ok(new ResponseEntity<List<ClassRoomDTO>>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "Success",
                Data = await _offDateService.GetAffectedClassByOffDateId(id),
            });
        }
    }
}
