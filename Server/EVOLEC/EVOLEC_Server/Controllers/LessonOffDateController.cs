using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models;
using EVOLEC_Server.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EVOLEC_Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LessonOffDateController : ControllerBase
    {
        private readonly ILessonOffDateService _lessonOffDateService;

        public LessonOffDateController(ILessonOffDateService lessonOffDateService)
        {
            _lessonOffDateService = lessonOffDateService;
        }

        [HttpGet("{lessonDateId}/{offDateId}")]
        public async Task<IActionResult> Get(int lessonDateId, int offDateId)
        {
            try
            {
                var result = await _lessonOffDateService.GetAsync(lessonDateId, offDateId);
                return Ok(new ResponseEntity<object>
                {
                    Status = true,
                    ResponseCode = 200,
                    StatusMessage = "Success",
                    Data =  result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseEntity<object>
                {
                    Status = false,
                    ResponseCode = 500,
                    StatusMessage = "Undefined Error",
                    Data = null
                });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var result = await _lessonOffDateService.GetAllAsync();
                return Ok(new ResponseEntity<object>
                {
                    Status = true,
                    ResponseCode = 200,
                    StatusMessage = "Lấy tất cả dữ liệu thành công",
                    Data = result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseEntity<object>
                {
                    Status = false,
                    ResponseCode = 500,
                    StatusMessage = "Undefined Error",
                    Data = null
                });
            }
        }

        [HttpGet("offdate/{offDateId}")]
        public async Task<IActionResult> GetAllByOffDateId(int offDateId)
        {
            try
            {
                var result = await _lessonOffDateService.GetAllByOffDateIdAsync(offDateId);
                return Ok(new ResponseEntity<object>
                {
                    Status = true,
                    ResponseCode = 200,
                    StatusMessage = "Success",
                    Data = result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseEntity<object>
                {
                    Status = false,
                    ResponseCode = 500,
                    StatusMessage = "Undefined Error",
                    Data = null
                });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] LessonOffDateCreateDto createDto)
        {
            try
            {
                var result = await _lessonOffDateService.CreateAsync(createDto);
                bool isCreateLessonDate = result != null;
                return Ok(new ResponseEntity<object>
                {
                    Status = true,
                    ResponseCode = isCreateLessonDate ? 200 : 201,
                    StatusMessage = isCreateLessonDate ? "Assign OffDate Successfully" : "Assign OffDate Failed",
                    Data = new { Id = result }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseEntity<object>
                {
                    Status = false,
                    ResponseCode = 500,
                    StatusMessage = "Undefined Error",
                    Data = null
                });
            }
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] LessonOffDateUpdateDto updateDto)
        {
            try
            {
                var result = await _lessonOffDateService.UpdateAsync(updateDto);
                if (!result)
                {
                    return NotFound(new ResponseEntity<object>
                    {
                        Status = false,
                        ResponseCode = 404,
                        StatusMessage = "Cannot find LessonOffDate",
                        Data = null
                    });
                }
                else
                {
                    return Ok(new ResponseEntity<object>
                    {
                        Status = true,
                        ResponseCode = result ? 200 : 400,
                        StatusMessage = result ? "Successful" : "Failed",
                        Data = new { }
                    });
                }
               
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseEntity<object>
                {
                    Status = false,
                    ResponseCode = 500,
                    StatusMessage = "Undefined Error",
                    Data = null
                });
            }
        }

        [HttpDelete("{lessonDateId}/{offDateId}")]
        public async Task<IActionResult> Delete(int lessonDateId, int offDateId)
        {
            try
            {
                var result = await _lessonOffDateService.DeleteAsync(lessonDateId, offDateId);
                if (!result)
                {
                    return NotFound(new ResponseEntity<object>
                    {
                        Status = false,
                        ResponseCode = 404,
                        StatusMessage = "LessonOffDate Not Found",
                        Data = null
                    });
                }
                else
                {
                    return Ok(new ResponseEntity<object>
                    {
                        Status = true,
                        ResponseCode = 200,
                        StatusMessage = "Delete Successfully",
                        Data = new { }
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseEntity<object>
                {
                    Status = false,
                    ResponseCode = 500,
                    StatusMessage = "Undefined Error",
                    Data = null
                });
            }
        }

        [HttpGet("affected/{id}")]
        public async Task<IActionResult> GetClassAffectedByOffDateId(int id)
        {
            //try
            //{
            //    var result = await _lessonOffDateService.GetClassRoomAffectedByOffDateId(id);
            //    return Ok(new ResponseEntity<object>
            //    {
            //        Status = true,
            //        ResponseCode = 200,
            //        StatusMessage = "Success",
            //        Data = result
            //    });
            //}
            //catch (Exception ex)
            //{
            //    return StatusCode(500, new ResponseEntity<object>
            //    {
            //        Status = false,
            //        ResponseCode = 500,
            //        StatusMessage = "Undefined Error",
            //        Data = null
            //    });

            //}

            var result = await _lessonOffDateService.GetClassRoomAffectedByOffDateId(id);
            return Ok(new ResponseEntity<object>
            {
                Status = true,
                ResponseCode = 200,
                StatusMessage = "Success",
                Data = result
            });
        }
    }
}
