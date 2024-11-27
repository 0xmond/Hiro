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
    [Route("/api/auth/login")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly IServiceManager _service;

        public LoginController(IServiceManager service)
        {
            _service = service;
        }


        [HttpPost]
        [ServiceFilter(typeof(ValidationFilterAttribute))]
        public async Task<IActionResult> Authenticate([FromBody] UserForLoginDto user)
        {

            if (!await _service.CompanyService.ValidateUser(user))
                return Unauthorized();


            var tokenDto = await _service.CompanyService.CreateToken(populateExp:true);

            return Ok(tokenDto);
        }
    }
}
