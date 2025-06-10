using AutoMapper;
using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models;
using EVOLEC_Server.Repositories;
using EVOLEC_Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace EVOLEC_Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnrollmentController : Controller
    {
        private readonly IEnrollmentService _enrollmentService;
        private readonly IMapper _mapper;

        public EnrollmentController(IEnrollmentService enrollmentService, IMapper mapper)
        {
            _enrollmentService = enrollmentService;
            _mapper = mapper;
        }
        // Get all enrollments
        [HttpGet]
        public async Task<IActionResult> GetAllEnrollments()
        {
            try { 
            
                var enrollments = await _enrollmentService.GetAllEnrollmentsAsync();

                return Ok(new ResponseEntity<IEnumerable<EnrollmentResponseDTO>>
                {
                    Status = true,
                    ResponseCode = 200,
                    StatusMessage = "Success",
                    Data = enrollments,
                });
            }
            catch(Exception ex)
            {
                return StatusCode(500, new ResponseEntity<string>
                {
                    Status = false,
                    ResponseCode = 500,
                    StatusMessage = "Undefined Error",
                    Data = ex.Message
                });
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateEnrollment([FromBody] EnrollmentCreateDTO request)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(new ResponseEntity<List<string>>
                {
                    Status = false,
                    ResponseCode = 400,
                    StatusMessage = "Dữ liệu đầu vào không hợp lệ",
                    Data = errors
                });
            }

            var result = await _enrollmentService.CreateAsync(request);

            if (result > 0)
            {
                return Ok(new ResponseEntity<object>
                {
                    Status = true,
                    ResponseCode = 200,
                    StatusMessage = "Tạo enrollment thành công",
                    Data = new
                    {
                        Id = result
                    }
                });
            }
            else
            {
                return BadRequest(new ResponseEntity<object>
                {
                    Status = false,
                    ResponseCode = 400,
                    StatusMessage = "Unidentified error",
                    Data = null
                });
            }
        }

    

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateEnrollment(int id, [FromBody] EnrollmentUpdateDTO request)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(new ResponseEntity<List<string>>
                {
                    Status = false,
                    ResponseCode = 400,
                    StatusMessage = "Dữ liệu đầu vào không hợp lệ",
                    Data = errors
                });
            }

            var result = await _enrollmentService.UpdateAsync(id, request);

            if (result > 0)
            {
                return Ok(new ResponseEntity<object>
                {
                    Status = true,
                    ResponseCode = 200,
                    StatusMessage = "Cập nhật enrollment thành công",
                    Data = new
                    {
                        Id = result
                    }
                });
            }
            else
            {
                switch (result)
                {
                    case -1:
                        return NotFound(new ResponseEntity<object>
                        {
                            Status = false,
                            ResponseCode = 404,
                            StatusMessage = "Enrollment không tồn tại",
                            Data = null
                        });
                    case -2:
                        return BadRequest(new ResponseEntity<object>
                        {
                            Status = false,
                            ResponseCode = 400,
                            StatusMessage = "Student hoặc ClassRoom không tồn tại",
                            Data = null
                        });
                    default:
                        return BadRequest(new ResponseEntity<object>
                        {
                            Status = false,
                            ResponseCode = 400,
                            StatusMessage = "Lỗi không xác định",
                            Data = null
                        });
                }
            }
        }

    } 
}
