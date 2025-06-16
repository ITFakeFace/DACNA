using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models; // Namespace chứa ResponseEntity<T>
using EVOLEC_Server.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
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
                switch (result)
                {
                    case 2:
                        return Ok(new ResponseEntity<object>
                        {

                            Status = true,
                            ResponseCode = isCreateLessonDate ? 200 : 201,
                            StatusMessage = "Create LessonDate Failed. There is a lessonDate not having teacher or ClassRoom",
                            Data = new
                            {
                                Id = result
                            }

                        });
                    default:
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

            }
            else
            {
                switch (result)
                {
                    case -1:
                        return BadRequest(new ResponseEntity<object>
                        {
                            Status = false,
                            ResponseCode = 400,
                            StatusMessage = "TeacherID1 not found",
                            Data = null!
                        });
                    case -2:
                        return BadRequest(new ResponseEntity<object>
                        {
                            Status = false,
                            ResponseCode = 400,
                            StatusMessage = "TeacherID2 not found",
                            Data = null!
                        });
                    default:
                        return BadRequest(new ResponseEntity<object>
                        {
                            Status = false,
                            ResponseCode = 400,
                            StatusMessage = "Unidentified error",
                            Data = null!
                        });
                }
            }
            return BadRequest(new ResponseEntity<object>
            {
                Status = false,
                ResponseCode = 400,
                StatusMessage = "Unidentified error",
                Data = null!
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ClassRoomUpdateDto classRoom)
        {
            var result = await _classRoomService.UpdateAsync(id, classRoom);
            switch (result)
            {
                case 1:
                    return Ok(new ResponseEntity<string>
                    {
                        Status = true,
                        ResponseCode = 200,
                        StatusMessage = "Successfully",
                        Data = null
                    });
                case 2:
                    return Ok(new ResponseEntity<string>
                    {
                        Status = true,
                        ResponseCode = 201,
                        StatusMessage = "Shift is null, please update shift to create lesson date",
                        Data = null
                    });
                case 3:
                    return Ok(new ResponseEntity<string>
                    {
                        Status = true,
                        ResponseCode = 201,
                        StatusMessage = "StartDate is null, please update start date to create lesson date",
                        Data = null
                    });
                case 4:
                    return Ok(new ResponseEntity<string>
                    {
                        Status = true,
                        ResponseCode = 201,
                        StatusMessage = "Shift and StartDate is null, please update shift and start date to create lesson date",
                        Data = null
                    });
                default:
                    return BadRequest(new ResponseEntity<string>
                    {
                        Status = false,
                        ResponseCode = 400,
                        StatusMessage = "Unidentified error",
                        Data = null
                    });
            }

        }

        [HttpGet("get-students/{id}")]
        public async Task<IActionResult> GetStudentsById(int id)
        {
            return Ok(new ResponseEntity<IEnumerable<UserDto>>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "Success",
                Data = await _classRoomService.GetStudentsByIdAsync(id),
            });
        }

    }
}
