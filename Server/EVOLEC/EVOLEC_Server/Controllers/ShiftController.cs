using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography.X509Certificates;

namespace EVOLEC_Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShiftController : ControllerBase
    {
        [HttpGet("getAllShifts")]
        public IActionResult getAllShifts()
        {
            List<Shift> shifts = ShiftSchedule._shiftList;
            return Ok(new ResponseEntity<object>
            {

                Status = true,
                ResponseCode = 200,
                StatusMessage = "Successfully",
                Data = shifts

            });
        }
    }
}
