using EVOLEC_Server.Dtos;
using EVOLEC_Server.DTOs.Lesson;
using EVOLEC_Server.Models;
using EVOLEC_Server.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EVOLEC_Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LessonController : ControllerBase
    {
        private readonly ILessonService _lessonService;

        public LessonController(ILessonService lessonService)
        {
            _lessonService = lessonService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllLessons()
        {
            var lessons = await _lessonService.GetAllLessonsAsync();
            return Ok(new ResponseEntity<IEnumerable<LessonDto>>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "Success",
                Data = lessons
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetLessonById(int id)
        {
            var lesson = await _lessonService.GetLessonByIdAsync(id);
            if (lesson == null)
            {
                return NotFound(new ResponseEntity<string>
                {
                    Status = false,
                    ResponseCode = 404,
                    StatusMessage = "Lesson not found",
                    Data = null
                });
            }

            return Ok(new ResponseEntity<LessonDto>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "Success",
                Data = lesson
            });
        }

        [HttpGet("get-by-course-id/{courseId}")]
        public async Task<IActionResult> GetLessonByCourseId(int courseId)
        {
            var lessons = await _lessonService.GetLessonByCourseIdAsync(courseId);
            return Ok(new ResponseEntity<IEnumerable<LessonDto>>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "Success",
                Data = lessons
            });
        }

        [HttpPost]
        public async Task<IActionResult> CreateLesson([FromBody] LessonCreateDto dto)
        {
            Console.WriteLine("\n\nCreate Lesson\n\n");
            var lesson = await _lessonService.CreateLessonAsync(dto);
            return CreatedAtAction(nameof(GetLessonById), new { id = lesson.Id }, new ResponseEntity<LessonDto>
            {
                Status = true,
                ResponseCode = 201,
                StatusMessage = "Lesson created successfully",
                Data = lesson
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLesson(int id, [FromBody] LessonUpdateDto dto)
        {
            var success = await _lessonService.UpdateLessonAsync(id, dto);
            if (!success)
            {
                return BadRequest(new ResponseEntity<string>
                {
                    Status = false,
                    ResponseCode = 400,
                    StatusMessage = "Failed to update lesson",
                    Data = null
                });
            }

            return Ok(new ResponseEntity<string>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "Lesson updated successfully",
                Data = null
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLesson(int id)
        {
            var success = await _lessonService.DeleteLessonAsync(id);
            if (!success)
            {
                return NotFound(new ResponseEntity<string>
                {
                    Status = false,
                    ResponseCode = 404,
                    StatusMessage = "Lesson not found for deletion",
                    Data = null
                });
            }

            return Ok(new ResponseEntity<string>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "Lesson deleted successfully",
                Data = null
            });
        }
    }
}
