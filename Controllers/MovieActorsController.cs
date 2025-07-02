using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using imdb_web_api.Data;
using imdb_web_api.Models;

namespace imdb_web_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovieActorsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MovieActorsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/MovieActors
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MovieActor>>> GetMovieActors()
        {
            return await _context.MovieActors.ToListAsync();
        }
    }
} 