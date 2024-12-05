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
    public class CompaniesAuthController : ControllerBase
    {
        private readonly IServiceManager _service;

        public CompaniesAuthController(IServiceManager service)
        {
            _service = service;
        }


        [HttpPost("company")]
        //[ServiceFilter(typeof(ValidationFilterAttribute))]
        public async Task<IActionResult> CreateCompany([FromBody] CompanyForCreationDto company)
        {
            if (company is null)
                return BadRequest("null");

            if (!ModelState.IsValid)
                return UnprocessableEntity(ModelState);


            var result = await _service.CompanyService.CreateCompanyAsync(company);

            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.TryAddModelError(error.Code, error.Description);
                }

                return BadRequest(ModelState);
            }

            return Created("", new { Message = "Company created successfully"});
        }
    }
}
