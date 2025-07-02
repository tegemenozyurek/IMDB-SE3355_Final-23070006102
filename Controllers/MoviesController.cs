using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using imdb_web_api.Data;
using imdb_web_api.Models;

namespace imdb_web_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MoviesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MoviesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Movies
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Movie>>> GetMovies()
        {
            return await _context.Movies.ToListAsync();
        }

        // GET: api/Movies/Top10
        [HttpGet("Top10")]
        public async Task<ActionResult<IEnumerable<Movie>>> GetTop10Movies()
        {
            return await _context.Movies
                .OrderByDescending(m => m.Rating)
                .ThenBy(m => m.Title)
                .Take(10)
                .ToListAsync();
        }

        // GET: api/Movies/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Movie>> GetMovieById(int id)
        {
            var movie = await _context.Movies.FindAsync(id);
            if (movie == null)
            {
                return NotFound();
            }
            return movie;
        }
    }
} 