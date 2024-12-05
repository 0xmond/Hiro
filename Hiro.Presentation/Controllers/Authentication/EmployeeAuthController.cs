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
    public class EmployeeAuthController : ControllerBase
    {
        private readonly IServiceManager _service;

        public EmployeeAuthController(IServiceManager serviceManager)
        {
            _service = serviceManager;
        }


        [HttpPost("employee")]
        [ServiceFilter(typeof(ValidationFilterAttribute))]
        public async Task<IActionResult> RegisterEmployee([FromBody] EmployeeForCreationDto employeeForCreation)
        {

            var result = await _service.EmployeeAuthService.CreateEmployeeAsync(employeeForCreation);

            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.TryAddModelError(error.Code, error.Description);
                }

                return BadRequest(ModelState);
            }

            return Created("", new { Message = "Employee created successfully" });
        }
    }
}
