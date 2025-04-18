using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models;
using EVOLEC_Server.Securities.Jwt;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace EVOLEC_Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly JwtTokenGenerator _tokenGenerator;
        public AuthenticationController(UserManager<ApplicationUser> userManager, JwtTokenGenerator tokenGenerator)
        {
            _userManager = userManager;
            _tokenGenerator = tokenGenerator;
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
                StatusMessage = "Invalid credentials"
            });
        }
    }
}
