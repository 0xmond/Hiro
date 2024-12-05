using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hiro.Controllers
{
    [Route("/")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "v1")]
    public class HomeController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetHome()
        {
            return Ok("Hola Amigos!");
        }
    }
}
