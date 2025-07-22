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
                    StatusMessage = "Invalid input data",
                    Data = errors
                });
            }

            var result = await _classRoomService.CreateAsync(request);

            if (result > 0 || result ==-4 || result ==-5 || result ==-6)
            {
                bool isCreateLessonDate = (request.Shift.HasValue && !request.StartDate.ToString().IsNullOrEmpty());
                switch (result)
                {
                    case -4:
                        return Ok(new ResponseEntity<string>
                        {
                            Status = true,
                            ResponseCode = 201,
                            StatusMessage =  "Classroom created successfully but cannot create lesson dates Lesson Not Found",
                            Data = null
                        });
                    case -5:
                        return Ok(new ResponseEntity<string>
                        {
                            Status = true,
                            ResponseCode = 201,
                            StatusMessage = "Classroom created successfully  but cannot create lesson dates Including Lessondate cannot assign teacher",
                            Data = null
                        });
                  
                    default:
                        return Ok(new ResponseEntity<string>
                        {
                            Status = true,
                            ResponseCode = 200,
                            StatusMessage = "Classroom created successfully but cannot create lesson dates",
                            Data = null
                        });
                }
            }
            else
            {
                return result switch
                {
                    -1 => BadRequest(new ResponseEntity<object>
                    {
                        Status = false,
                        ResponseCode = 400,
                        StatusMessage = "Teacher1 not found",
                        Data = null!
                    }),
                    -2 => BadRequest(new ResponseEntity<object>
                    {
                        Status = false,
                        ResponseCode = 400,
                        StatusMessage = "Teacher2 not found",
                        Data = null!
                    }),
                    -3 => StatusCode(500, new ResponseEntity<object>
                    {
                        Status = false,
                        ResponseCode = 500,
                        StatusMessage = "Server error",
                        Data = null!
                    }),
                    -4 => BadRequest(new ResponseEntity<object>
                    {
                        Status = false,
                        ResponseCode = 400,
                        StatusMessage = "No valid lesson dates",
                        Data = null!
                    }),
                    -5 => BadRequest(new ResponseEntity<object>
                    {
                        Status = false,
                        ResponseCode = 400,
                        StatusMessage = "Cannot assign teacher",
                        Data = null!
                    }),
                    -6 => StatusCode(500, new ResponseEntity<object>
                    {
                        Status = false,
                        ResponseCode = 500,
                        StatusMessage = "Unknown lesson date error",
                        Data = null!
                    }),
                    _ => StatusCode(500, new ResponseEntity<object>
                    {
                        Status = false,
                        ResponseCode = 500,
                        StatusMessage = "Unknown error",
                        Data = null!
                    })
                };
            }
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
