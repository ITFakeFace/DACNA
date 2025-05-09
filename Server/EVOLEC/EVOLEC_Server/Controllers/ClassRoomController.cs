using Microsoft.AspNetCore.Mvc;
using EVOLEC_Server.Services;
using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models; // Namespace chứa ResponseEntity<T>
using System.Text.Json;
using System.Text.Json.Serialization;


namespace EVOLEC_Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClassRoomController : ControllerBase
    {
        private readonly IClassRoomService _classRoomService;

        public ClassRoomController(IClassRoomService classRoomService)
        {
            _classRoomService = classRoomService;
        }

        // GET: api/ClassRoom
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _classRoomService.GetAllAsync();

            // Cấu hình JsonSerializer để xử lý vòng lặp
            var options = new JsonSerializerOptions
            {
                ReferenceHandler = ReferenceHandler.Preserve, // Giữ lại các tham chiếu và xử lý vòng lặp
                MaxDepth = 64 // Tùy chọn tăng độ sâu nếu cần thiết (nếu bạn gặp lỗi do quá độ sâu)
            };

            // Trả về dữ liệu đã được serialize với các tùy chọn đã cấu hình
            var jsonResponse = JsonSerializer.Serialize(new ResponseEntity<IEnumerable<ClassRoomDTO>>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "Danh sách lớp học",
                Data = data
            }, options);

            return Ok(jsonResponse);
        }


        // GET: api/ClassRoom/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var classroom = await _classRoomService.GetByIdAsync(id);
            if (classroom == null)
            {
                return NotFound(new ResponseEntity<string>
                {
                    Status = false,
                    ResponseCode = 404,
                    StatusMessage = "Không tìm thấy lớp học",
                    Data = null,
                });
            }

            return Ok(new ResponseEntity<ClassRoomDTO>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "Tìm thấy lớp học",
                Data = classroom
            });
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateClassRoom([FromBody] ClassRoomDTO request)
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

            var result = await _classRoomService.CreateAsync(request);

            if (result == -1)
            {
                return BadRequest(new ResponseEntity<object>
                {
                    Status = false,
                    ResponseCode = 400,
                    StatusMessage = "Tạo lớp học thất bại",
                    Data = new
                    {
                        Id = result
                    }
                });
            }

            return Ok(new ResponseEntity<object>
            {
                Status = true,
                ResponseCode = 201,
                StatusMessage = "Tạo lớp học thành công",
                Data = new
                {
                    Id = result
                }

            });

        }

    }
}
