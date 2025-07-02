using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using imdb_web_api.Data;
using imdb_web_api.Models;
using System.Linq;
using System.Threading.Tasks;

namespace imdb_web_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SearchController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SearchController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Search?q=arama
        [HttpGet]
        public async Task<IActionResult> Search([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q))
                return BadRequest(new { message = "Arama terimi boş olamaz." });

            var movies = await _context.Movies
                .Where(m => m.Title.Contains(q))
                .Select(m => new { type = "movie", m.MovieID, m.Title, relevance = m.Title.StartsWith(q) ? 2 : 1 })
                .ToListAsync();

            var actors = await _context.Actors
                .Where(a => a.Name.Contains(q))
                .Select(a => new { type = "actor", a.ActorID, a.Name, relevance = a.Name.StartsWith(q) ? 2 : 1 })
                .ToListAsync();

            var result = movies.Concat<object>(actors)
                .OrderByDescending(x => (int)x.GetType().GetProperty("relevance").GetValue(x))
                .Take(3);

            return Ok(result);
        }
    }
} 