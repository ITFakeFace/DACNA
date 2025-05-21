using EVOLEC_Server.Dtos;
using EVOLEC_Server.DTOs.Lesson;
using EVOLEC_Server.Models;
using EVOLEC_Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace EVOLEC_Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LessonDateController : ControllerBase
    {
        private readonly ILessonDateService _lessonDateService;

        public LessonDateController(ILessonDateService lessonDateService)
        {
            _lessonDateService = lessonDateService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var lessonDate = await _lessonDateService.GetLessonDateByIdAsync(id);
            if (lessonDate == null)
            {
                return NotFound(new ResponseEntity<string>
                {
                    Status = false,
                    ResponseCode = 404,
                    StatusMessage = "Không tìm thấy buổi học",
                    Data = null
                });
            }

            return Ok(new ResponseEntity<LessonDateDto>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "Thành công",
                Data = lessonDate
            });
        }

        [HttpGet("classroom/{classRoomId}")]
        public async Task<IActionResult> GetByClassRoomId(int classRoomId)
        {
            var lessonDates = await _lessonDateService.GetLessonDatesByClassIdAsync(classRoomId);
            return Ok(new ResponseEntity<IEnumerable<LessonDateDto>>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "Thành công",
                Data = lessonDates
            });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] LessonDateCreateDto dto)
        {
            var result = await _lessonDateService.CreateLessonDateAsync(dto);
            if(result is null)
            {
                return Ok(new ResponseEntity<IEnumerable<LessonDateDto>>
                {
                    Status = true,
                    ResponseCode = 400,
                    StatusMessage = "Ngày học không thể trùng vào ngày nghĩ",
                    Data = null
                });
            }
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, new ResponseEntity<LessonDateDto>
            {
                Status = true,
                ResponseCode = 201,
                StatusMessage = "Tạo buổi học thành công",
                Data = result
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] LessonDateUpdateDto dto)
        {
            var success = await _lessonDateService.UpdateLessonDateAsync(id, dto);
            Dictionary<int, string> _resultMapping = new Dictionary<int, string>()
            {
                {-1,"Lỗi không xác định" },
                {-2,"Không tìm thấy buổi học" },
            };
            if (success <=-1)
            {
                return BadRequest(new ResponseEntity<string>
                {
                    Status = false,
                    ResponseCode = 400,
                    StatusMessage = _resultMapping.GetValueOrDefault(success),
                    Data = null
                });
            }

            return Ok(new ResponseEntity<string>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "Cập nhật buổi học thành công",
                Data = null
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _lessonDateService.DeleteLessonDateAsync(id);
            if (!success)
            {
                return NotFound(new ResponseEntity<string>
                {
                    Status = false,
                    ResponseCode = 404,
                    StatusMessage = "Không tìm thấy buổi học để xóa",
                    Data = null
                });
            }

            return Ok(new ResponseEntity<string>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "Xóa buổi học thành công",
                Data = null
            });
        }
    }
}
