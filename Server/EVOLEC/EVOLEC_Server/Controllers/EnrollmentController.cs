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

            var enrollments = await _enrollmentService.GetAllEnrollmentsAsync();
 
            return Ok(new ResponseEntity<IEnumerable<EnrollmentDto>>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "Success",
                Data = enrollments,
            });
        }

    }
}
