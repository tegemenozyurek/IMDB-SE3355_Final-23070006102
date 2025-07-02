using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using imdb_web_api.Data;
using imdb_web_api.Models;

namespace imdb_web_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ActorsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ActorsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Actors
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Actor>>> GetActors()
        {
            return await _context.Actors.ToListAsync();
        }

        // POST: api/Actors
        [HttpPost]
        public async Task<IActionResult> PostActor([FromBody] Actor actor)
        {
            _context.Actors.Add(actor);
            await _context.SaveChangesAsync();
            return Ok(new { actor.ActorID, actor.Name });
        }

        // POST: api/Actors/AddMovie
        [HttpPost("AddMovie")]
        public async Task<IActionResult> AddMovieToActor([FromBody] MovieActor movieActor)
        {
            _context.MovieActors.Add(movieActor);
            await _context.SaveChangesAsync();
            return Ok(new { movieActor.MovieID, movieActor.ActorID });
        }

        // GET: api/Actors/{actorId}/Movies
        [HttpGet("{actorId}/Movies")]
        public async Task<IActionResult> GetMoviesByActor(int actorId)
        {
            var movies = await _context.MovieActors
                .Where(ma => ma.ActorID == actorId)
                .Select(ma => ma.Movie)
                .ToListAsync();
            return Ok(movies);
        }
    }
} 