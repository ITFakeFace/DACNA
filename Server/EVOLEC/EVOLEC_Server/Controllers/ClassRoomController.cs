using Microsoft.AspNetCore.Mvc;
using EVOLEC_Server.Services;
using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models; // Namespace chứa ResponseEntity<T>
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.IdentityModel.Tokens;


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
        public async Task<IActionResult> CreateClassRoom([FromBody] ClassRoomCreateDTO request)
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

            if (result > 0)
            {
                bool isCreateLessonDate = (request.Shift.HasValue && !request.StartDate.ToString().IsNullOrEmpty());
                return Ok(new ResponseEntity<object>
                {

                    Status = true,
                    ResponseCode = isCreateLessonDate ? 200 : 201,
                    StatusMessage = isCreateLessonDate
                    ? "Tạo lớp học thành công"
                    : "Vui lòng nhập ca học và ngày học để tạo lessonDate",
                    Data = new
                    {
                        Id = result
                    }

                });
            }
            else
            {
                Dictionary<int,string> _errorMapping = new Dictionary<int, string>()
                {
                    { -1,"TeacherID1 không tồn tại"},
                    { -2,"TeacherID2 không tồn tại"},
                    { -3, "Lỗi không xác định" }
                };
                return BadRequest(new ResponseEntity<object>
                {
                    Status = false,
                    ResponseCode = 400,
                    StatusMessage = _errorMapping.GetValueOrDefault(result),
                    Data = null!
                });
            }

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ClassRoomUpdateDto classRoom)
        {
            var result = await _classRoomService.UpdateAsync(id, classRoom);
            Dictionary<int, string> _resultMapping = new Dictionary<int, string>
            {
                { 1, "Tạo lớp học thành công" },
                { 2, "Shift không có giá trị. Vui lòng cập nhật để tạo lessonDate" },
                { 3, "Start Date không có giá trị. Vui lòng cập nhật để tạo lessonDate" },
                { 4, "Shift Date và StartDate ko có giá trị. Vui lòng cập nhật để tạo lessonDate" },
                { -2, "Lỗi không xác định" }
            };

            if (result <0 )
            {
                return StatusCode(500, new ResponseEntity<string>
                {
                    Status = false,
                    ResponseCode = 500,
                    StatusMessage = _resultMapping.GetValueOrDefault(result),
                    Data = null
                });
            }

            return Ok(new ResponseEntity<bool>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = _resultMapping.GetValueOrDefault(result),
                Data = result>0
            });
        }


    }
}
