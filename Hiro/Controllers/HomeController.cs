using Microsoft.AspNetCore.Mvc;

namespace Hiro.Controllers
{
    [Route("api/home")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        public IActionResult GetHome()
        {
            return Ok("Hola Amigos!");
        }
    }
}
