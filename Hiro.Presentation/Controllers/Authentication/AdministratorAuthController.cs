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
    [Route("/api/auth/admin")]
    [ApiController]
    public class AdministratorAuthController : ControllerBase
    {
        private readonly IServiceManager _service;

        public AdministratorAuthController(IServiceManager serviceManager)
        {
            _service = serviceManager;
        }


        [HttpPost]
        public async Task<IActionResult> RegisterAdministrator([FromBody] AdministratorForCreationDto administratorForCreation)
        {
            if (administratorForCreation is null)
                return BadRequest("null");

            if (!ModelState.IsValid)
                return UnprocessableEntity(ModelState);

            var result = await _service.AdministratorService.CreateAdministratorAsync(administratorForCreation);

            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.TryAddModelError(error.Code, error.Description);
                }

                return BadRequest(ModelState);
            }

            return StatusCode(201);
        }
        
    }
}
