using Microsoft.AspNetCore.Mvc;

namespace Hiro.Controllers
{
    [Route("api/home")]
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
