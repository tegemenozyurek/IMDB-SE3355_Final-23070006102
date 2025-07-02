using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using imdb_web_api.Data;

namespace imdb_web_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DatabaseTestController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DatabaseTestController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("test-connection")]
        public async Task<IActionResult> TestConnection()
        {
            try
            {
                // Database bağlantısını test et
                await _context.Database.CanConnectAsync();
                
                return Ok(new { 
                    message = "Database bağlantısı başarılı!", 
                    timestamp = DateTime.UtcNow,
                    server = "imdb-db-server.database.windows.net",
                    database = "imdb-db"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { 
                    message = "Database bağlantısı başarısız!", 
                    error = ex.Message,
                    timestamp = DateTime.UtcNow
                });
            }
        }
    }
} 