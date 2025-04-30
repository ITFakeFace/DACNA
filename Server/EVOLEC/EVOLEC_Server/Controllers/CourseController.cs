using AutoMapper;
using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models;
using EVOLEC_Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EVOLEC_Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly ICourseService _courseService;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        public CourseController(ICourseService courseService, IUserService userService, IMapper mapper)
        {
            _courseService = courseService;
            _userService = userService;
            _mapper = mapper;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCourseById(int id)
        {
            var course = await _courseService.GetCourseByIdAsync(id);
            if (course == null)
                return NotFound(new ResponseEntity<string>
                {
                    Status = false,
                    ResponseCode = 404,
                    StatusMessage = "Không tìm thấy khóa học",
                    Data = null,
                });

            return Ok(new ResponseEntity<CourseDto>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "Thành công",
                Data = course,
            });
        }

        [HttpGet("with-creator/{id}")]
        public async Task<IActionResult> GetCourseIncludeCreatorById(int id)
        {
            var course = await _courseService.GetCourseByIdAsync(id);
            var creator = await _userService.FindById(course.CreatorId);
            course.Creator = _mapper.Map<ShortInformationUser>(creator);
            if (course == null)
                return NotFound(new ResponseEntity<string>
                {
                    Status = false,
                    ResponseCode = 404,
                    StatusMessage = "Không tìm thấy khóa học",
                    Data = null,
                });

            return Ok(new ResponseEntity<CourseDto>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "Thành công",
                Data = course,
            });
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCourses()
        {
            var courses = await _courseService.GetAllCoursesAsync();
            return Ok(new ResponseEntity<IEnumerable<CourseDto>>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "Thành công",
                Data = courses,
            });
        }

        [HttpPost]
        public async Task<IActionResult> CreateCourse([FromBody] CourseCreateDto courseCreateDto)
        {
            /*var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId == null)
                return BadRequest(new ResponseEntity<string>
                {
                    Status = false,
                    ResponseCode = 400,
                    StatusMessage = "Không thể xác định người tạo",
                    Data = null,
                });

            courseCreateDto.CreatorId = currentUserId;*/
            var course = await _courseService.CreateCourseAsync(courseCreateDto);
            return CreatedAtAction(nameof(GetCourseById), new { id = course.Id }, new ResponseEntity<string>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "Tạo khóa học thành công",
                Data = null,
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCourse(int id, [FromBody] CourseUpdateDto courseUpdateDto)
        {
            var result = await _courseService.UpdateCourseAsync(id, courseUpdateDto);
            if (!result) return BadRequest(new ResponseEntity<string>
            {
                Status = false,
                ResponseCode = 400,
                StatusMessage = "Cập nhật khóa học thất bại",
                Data = null,
            });

            return Ok(new ResponseEntity<string>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "Cập nhật khóa học thành công",
                Data = null,
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            var result = await _courseService.DeleteCourseAsync(id);
            if (!result) return NotFound();

            return Ok(new ResponseEntity<string>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "Xóa khóa học thành công",
                Data = null,
            });
        }
    }
}
