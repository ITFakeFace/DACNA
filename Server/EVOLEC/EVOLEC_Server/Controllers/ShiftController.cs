using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace EVOLEC_Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShiftController : ControllerBase
    {
        [HttpGet("getAllShifts")]
        public IActionResult getAllShifts()
        {
            return Ok(new ResponseEntity<object>
            {

                Status = true,
                ResponseCode = 200,
                StatusMessage = "Successfully",
                Data = ShiftSchedule._shiftList

            });
        }
    }
}
