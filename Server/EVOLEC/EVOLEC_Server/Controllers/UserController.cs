using EVOLEC_Server.CustomException;
using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models;
using EVOLEC_Server.Securities.Jwt;
using EVOLEC_Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Security.Claims;

namespace EVOLEC_Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly JwtHelper _jwtHelper;
        private readonly UserManager<ApplicationUser> _userManager;
        public UserController(IUserService userService, JwtHelper jwtHelper, UserManager<ApplicationUser> userManager)
        {
            _userService = userService;
            _jwtHelper = jwtHelper;
            _userManager = userManager;
        }

        [HttpGet("test-auth")]
        //[Authorize]
        public IActionResult Test([FromQuery] string token)
        {
            return Ok(_jwtHelper.ValidateJwtToken(token));
        }

        // Lấy tất cả người dùng
        [Authorize] // Chỉ admin mới có quyền truy cập
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            Console.WriteLine("\n\nRun GetAllUsers\n\n");
            var users = await _userService.FindAll();
            var results = new List<UserDto>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                results.Add(new UserDto
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    PID = user.PID,
                    Fullname = user.Fullname,
                    Dob = user.Dob,
                    Gender = user.Gender,
                    Address = user.Address,
                    Role = roles.FirstOrDefault() ?? "", // hoặc join nhiều role nếu cần
                    Lockout = user.LockoutEnd?.UtcDateTime
                });
            }
            return Ok(new ResponseEntity<List<UserDto>>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "Success",
                Data = results
            });
        }


        [HttpGet("teachers")]
        public async Task<IActionResult> GetAllTeachers()
        {
            var users = await _userService.GetTeachersAsync();
            var results = new List<ShortInformationTeacher>();
            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                results.Add(new ShortInformationTeacher
                {
                    Id = user.Id,
                    Username = user.UserName,
                    Email = user.Email,
                    Fullname = user.Fullname,
                    Gender = user.Gender

                });
            }

            return Ok(new ResponseEntity<List<ShortInformationTeacher>>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "Success",
                Data = results
            });
        }
        [HttpGet("students")]
        public async Task<IActionResult> GetAllStudents()
        {
            var users = await _userService.GetStudentsAsync();
            var results = new List<ShortInfomationStudent>();
            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                results.Add(new ShortInfomationStudent
                {
                    Id = user.Id,
                    Username = user.UserName,
                    Email = user.Email,
                    Fullname = user.Fullname,
                    Gender = user.Gender,
                    PID = user.PID
                });
            }

            return Ok(new ResponseEntity<List<ShortInfomationStudent>>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "Success",
                Data = results
            });
        }

        // Lấy thông tin người dùng theo Id
        [HttpGet("{id}")]
        [Authorize] // Cả admin và user có thể truy cập, nhưng user chỉ xem thông tin của chính mình
        public async Task<IActionResult> GetUserById(string id)
        {
            var user = await _userService.FindById(id);
            if (user == null)
            {
                return NotFound(new ResponseEntity<string>
                {
                    Status = false,
                    ResponseCode = 404,
                    StatusMessage = "Không tìm thấy tài khoản",
                    Data = "Không tìm thấy tài khoản"
                });
            }
            var roles = await _userManager.GetRolesAsync(user);
            var result = new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                PID = user.PID,
                Fullname = user.Fullname,
                Dob = user.Dob,
                Gender = user.Gender,
                Address = user.Address,
                Role = roles.FirstOrDefault() ?? "", // hoặc join nhiều role nếu cần
                Lockout = user.LockoutEnd?.UtcDateTime
            };
            return Ok(new ResponseEntity<UserDto>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "Success",
                Data = result
            });
        }

        // Tạo người dùng mới
        [HttpPost]
        [Authorize(Roles = "ADMIN")] // Chỉ admin mới có quyền tạo người dùng
        public async Task<IActionResult> CreateUser([FromBody] UserCreateDto model)
        {
            Console.WriteLine("Creating User");
            var result = await _userService.Create(model);
            if (!result)
            {
                return BadRequest(new ResponseEntity<string>
                {
                    Status = false,
                    ResponseCode = 400,
                    StatusMessage = "Không thể tạo user",
                    Data = "Không thể tạo user"
                });
            }
            return CreatedAtAction(nameof(GetUserById), new { id = model.UserName }, new ResponseEntity<string>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "Tạo user thành công",
                Data = "Tạo user thành công"
            });
        }

        // Cập nhật thông tin người dùng
        [Authorize] // Cả admin và user có thể cập nhật, nhưng user chỉ có thể cập nhật chính mình
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UserUpdateDto model)
        {
            Console.WriteLine("\nUpdating User\n");
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value; // hoặc Id / sub tùy theo bạn set claim

            // Nếu không tìm thấy user từ token
            if (string.IsNullOrEmpty(currentUserId))
            {
                return Unauthorized(new ResponseEntity<string>
                {
                    Status = false,
                    ResponseCode = 401,
                    StatusMessage = "Không xác thực được người dùng",
                    Data = "Không có quyền cập nhật"
                });
            }

            // Nếu không phải admin và đang cập nhật user khác => không cho phép
            if (!User.IsInRole("ADMIN") && currentUserId != id)
            {
                return Forbid();
            }

            var result = await _userService.Update(id, model);
            if (!result)
            {
                return BadRequest(new ResponseEntity<string>
                {
                    Status = false,
                    ResponseCode = 400,
                    StatusMessage = "Cập nhật thất bại",
                    Data = "Cập nhật tài khoản thất bại"
                });
            }

            return Ok(new ResponseEntity<string>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "Cập nhật thành công",
                Data = "Cập nhật tài khoản thành công"
            });
        }

        // Xóa người dùng
        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")] // Chỉ admin mới có quyền xóa người dùng
        public async Task<IActionResult> DeleteUser(string id)
        {
            var result = await _userService.Delete(id);
            if (!result)
            {
                return NotFound(new ResponseEntity<string>
                {
                    Status = false,
                    ResponseCode = 404,
                    StatusMessage = "Không tìm thấy tài khoản",
                    Data = null
                });
            }
            return Ok(new ResponseEntity<string>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "Xóa tài khoản thành công",
                Data = null
            });
        }

        // Thay đổi trạng thái người dùng (ban/unban)
        [HttpPut("ban/{id}")]
        [Authorize(Roles = "ADMIN")] // Chỉ admin mới có quyền thay đổi trạng thái
        public async Task<IActionResult> ToggleBan(string id, [FromQuery] bool enable)
        {
            try
            {
                var result = await _userService.ToggleStatus(id, enable);
                if (!result)
                {
                    return NotFound(new ResponseEntity<string>
                    {
                        Status = false,
                        ResponseCode = 400,
                        StatusMessage = "Không thể tìm thấy tài khoản hoặc cập nhật thất bại",
                        Data = null
                    });
                }

                return Ok(new ResponseEntity<string>
                {
                    Status = true,
                    ResponseCode = 200,
                    StatusMessage = !enable ? "Khóa tài khoản thành công" : "Gỡ khóa tài khoản thành công",
                    Data = null
                });
            }
            catch (AdminBanException ex)
            {
                return BadRequest(new ResponseEntity<string>
                {
                    Status = false,
                    ResponseCode = 403,
                    StatusMessage = ex.Message,
                    Data = null
                }); // Lỗi nếu cố gắng ban admin
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseEntity<string>
                {
                    Status = false,
                    ResponseCode = 500,
                    StatusMessage = "Lỗi không xác định xảy ra",
                    Data = ex.Message
                });
            }
        }

        [HttpGet("studying-lesson-dates/{studentId}")]
        public async Task<IActionResult> GetStudyingLessonDates(string studentId)
        {
            var result = await _userService.GetStudyingLessonDatesAsync(studentId);
            return Ok(new ResponseEntity<List<LessonDateScheduleDto>>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "",
                Data = result,
            });
        }

        [HttpGet("teaching-lesson-dates/{teacherId}")]
        public async Task<IActionResult> GetTeachingLessonDates(string teacherId)
        {
            var result = await _userService.GetTeachingLessonDatesAsync(teacherId);
            return Ok(new ResponseEntity<List<LessonDateScheduleDto>>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "",
                Data = result,
            });
        }
    }
}
