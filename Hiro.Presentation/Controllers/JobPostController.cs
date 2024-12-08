using Entities.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Contracts;
using Shared.DataTransferObjects.JobPostDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Hiro.Presentation.Controllers
{
    [ApiController]
    [Route("api/jobpost")]
    public class JobPostController : ControllerBase
    {
        private readonly IServiceManager _serviceManager;

        public JobPostController(IServiceManager serviceManager)
        {
            _serviceManager = serviceManager;
        }



        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAllJobPostsAsync()
        {
            var posts = await _serviceManager.JobPostService.GetAllJobPostsAsync(false);

            return Ok(posts);
        }
       

        [HttpGet("{id:guid}")]
        [Authorize]
        public async Task<IActionResult> GetJobPostById([FromRoute] string id)
        {
            var post = await _serviceManager.JobPostService.GetJobPostAsync(id, false);

            return Ok(post);
        } 
        
        
        
        [Authorize]
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteJobPost([FromBody] string postId)
        {
            if (string.IsNullOrEmpty(postId))
            {
                return BadRequest(new { message = "Bad request" });
            }

            if (!ModelState.IsValid)
            {
                return UnprocessableEntity(ModelState);
            }

            var post = await _serviceManager.JobPostService.GetJobPostAsync(postId, false);

            var uid = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!_serviceManager.JobPostService.isValid(post))
                return BadRequest(new { message = "Invalid job post id" });

            if (!_serviceManager.JobPostService.isOwn(uid, post.Company.UserId.ToString()))
                return Forbid();

            await _serviceManager.JobPostService.DeleteJobPost(postId);

            return Ok(new { message = "Job post deleted successfully" });
        }
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateJobPost([FromBody] JobPostRegisterDTO jobPostRegisterDto)
        {
            if (jobPostRegisterDto == null)
            {
                return BadRequest(new { message = "Job post data is null" });
            }

            if (!ModelState.IsValid)
            {
                return UnprocessableEntity(ModelState);
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "User not authorized" });
            }

            try
            {
                await _serviceManager.JobPostService.RegisterJobPostAsync(jobPostRegisterDto);
                return Ok(new { message = "Job post created successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }
    }
}
