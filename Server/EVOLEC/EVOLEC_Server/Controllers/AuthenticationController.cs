using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models;
using EVOLEC_Server.Securities.Jwt;
using EVOLEC_Server.Services;
using EVOLEC_Server.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace EVOLEC_Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly JwtTokenGenerator _tokenGenerator;
        private readonly SecurityUtil _securityUtil = new SecurityUtil();
        private readonly EmailService _emailService;
        private string _confirmCode { get; set; }
        public AuthenticationController(UserManager<ApplicationUser> userManager, JwtTokenGenerator tokenGenerator, EmailService emailService)
        {
            _userManager = userManager;
            _tokenGenerator = tokenGenerator;
            _emailService = emailService;
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user != null)
            {
                if (await _userManager.IsLockedOutAsync(user))
                    return BadRequest(new ResponseEntity<String>
                    {
                        Status = false,
                        ResponseCode = 400,
                        StatusMessage = "Tài khoản đang bị khóa",
                        Data = "Tài khoản đang bị khóa"
                    });

                if (await _userManager.CheckPasswordAsync(user, model.Password))
                {
                    var roles = await _userManager.GetRolesAsync(user);
                    var token = _tokenGenerator.GenerateToken(user, roles, model.RememberMe);

                    return Ok(new ResponseEntity<string>
                    {
                        Status = true,
                        ResponseCode = 200,
                        StatusMessage = "Login success",
                        Data = token
                    });
                }
            }

            return Unauthorized(new ResponseEntity<string>
            {
                Status = false,
                ResponseCode = 401,
                StatusMessage = "Invalid credentials",
                Data = null,
            });
        }
        [HttpPost("send-code-forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] EmailForgotPasswordDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user != null)
            {
                if (await _userManager.IsLockedOutAsync(user))
                    return BadRequest(new ResponseEntity<String>
                    {
                        Status = false,
                        ResponseCode = 400,
                        StatusMessage = "Account has been locked",
                        Data = null,
                    });
                var code = SecurityUtil.GenerateCode();
                _confirmCode = code;
                try
                {
                    _emailService.SendEmailForgotPassword(model.Email, code);
                }
                catch (Exception ex)
                {
                    return BadRequest(new ResponseEntity<String>
                    {
                        Status = false,
                        ResponseCode = 400,
                        StatusMessage = $"Cannot send to mail {model.Email}",
                        Data = null,
                    });
                }
                return Ok(new ResponseEntity<string>
                {
                    Status = true,
                    ResponseCode = 200,
                    StatusMessage = "Success",
                    Data = code,
                });
            }
            return Unauthorized(new ResponseEntity<string>
            {
                Status = false,
                ResponseCode = 401,
                StatusMessage = "Invalid credentials",
                Data = null,
            });
        }
        [HttpPost("confirm-code-forgot-password")]
        public async Task<IActionResult> ConfirmForgotPassword([FromBody] ForgotPasswordDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            Console.WriteLine($"User null? {user == null}");
            if (user != null)
            {
                Console.WriteLine($"\n\nCode: {_confirmCode}, Model: {JsonConvert.SerializeObject(model)}");
                if (model.ConfirmPassword == model.Password && model.Code == model.CorrectCode)
                {
                    await _userManager.RemovePasswordAsync(user);
                    await _userManager.AddPasswordAsync(user, model.Password);
                    return Ok(new ResponseEntity<string>
                    {
                        Status = true,
                        ResponseCode = 200,
                        StatusMessage = "Success",
                        Data = null,
                    });
                }
                else if (model.ConfirmPassword == model.Password && model.Code != model.CorrectCode)
                {
                    return Ok(new ResponseEntity<string>
                    {
                        Status = false,
                        ResponseCode = 402,
                        StatusMessage = "Invalid Code",
                        Data = null,
                    });
                }
            }
            return Unauthorized(new ResponseEntity<string>
            {
                Status = false,
                ResponseCode = 401,
                StatusMessage = "Invalid credentials",
                Data = null,
            });
        }

    }
}
