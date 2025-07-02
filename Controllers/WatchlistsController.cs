using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using imdb_web_api.Data;
using imdb_web_api.Models;

namespace imdb_web_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WatchlistsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public WatchlistsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Watchlists
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Watchlist>>> GetWatchlists()
        {
            return await _context.Watchlists.ToListAsync();
        }

        // GET: api/Watchlists/UserMovies/{userId}
        [HttpGet("UserMovies/{userId}")]
        public async Task<ActionResult<IEnumerable<Movie>>> GetUserWatchlistMovies(int userId)
        {
            var movies = await _context.Watchlists
                .Where(w => w.UserID == userId)
                .Select(w => w.Movie)
                .ToListAsync();
            return movies;
        }

        // POST: api/Watchlists/Add
        [HttpPost("Add")]
        public async Task<IActionResult> AddToWatchlist([FromBody] WatchlistAddRequest request)
        {
            // Zaten ekli mi kontrol et
            var exists = await _context.Watchlists.AnyAsync(w => w.UserID == request.UserID && w.MovieID == request.MovieID);
            if (exists)
            {
                return BadRequest(new { message = "Bu film zaten watchlist'te." });
            }

            var watchlist = new Watchlist
            {
                UserID = request.UserID,
                MovieID = request.MovieID
            };
            _context.Watchlists.Add(watchlist);
            await _context.SaveChangesAsync();

            return Ok(new { userID = watchlist.UserID, movieID = watchlist.MovieID });
        }

        // DELETE: api/Watchlists/Remove
        [HttpDelete("Remove")]
        public async Task<IActionResult> RemoveFromWatchlist([FromBody] WatchlistAddRequest request)
        {
            var watchlist = await _context.Watchlists
                .FirstOrDefaultAsync(w => w.UserID == request.UserID && w.MovieID == request.MovieID);
            if (watchlist == null)
            {
                return NotFound(new { message = "Bu film zaten watchlist'te yok." });
            }

            _context.Watchlists.Remove(watchlist);
            await _context.SaveChangesAsync();

            return Ok(new { userID = request.UserID, movieID = request.MovieID });
        }
    }
} 