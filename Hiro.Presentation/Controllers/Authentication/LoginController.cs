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
        public async Task<IActionResult> Authenticate([FromBody] UserForLoginDto user)
        {
            if (user is null)
                return BadRequest("null");

            if (!ModelState.IsValid)
                return UnprocessableEntity(ModelState);

            if (!await _service.CompanyService.ValidateUser(user))
                return Unauthorized();


            return Ok(new
            {
                Token = await _service.CompanyService.CreateToken()
            });
        }
    }
}
