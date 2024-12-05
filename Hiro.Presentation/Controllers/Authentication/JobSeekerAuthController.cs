using Hiro.Presentation.ActionFilters;
using Microsoft.AspNetCore.Mvc;
using Service.Contracts;
using Shared.DataTransferObjects.AuthenticationDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hiro.Presentation.Controllers.Authentication
{
    [Route("/api/auth")]
    [ApiController]
    public class JobSeekerAuthController : ControllerBase
    {
        private readonly IServiceManager _service;

        public JobSeekerAuthController(IServiceManager serviceManager)
        {
            _service = serviceManager;
        }

        [HttpPost("jobseeker")]
        [ServiceFilter(typeof(ValidationFilterAttribute))]
        public async Task<IActionResult> RegisterJobSeeker(JobSeekerForCreationDto jobSeekerForCreation)
        {
            var result = await _service.JobSeekerAuthService.CreateJobSeekerAsync(jobSeekerForCreation);

            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.TryAddModelError(error.Code, error.Description);
                }

                return BadRequest(ModelState);
            }

            return Created("", new { Message = "Job seeker created successfully" });
        }
    }
}
