using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using imdb_web_api.Data;
using imdb_web_api.Models;

namespace imdb_web_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReviewsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Reviews
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviews()
        {
            return await _context.Reviews.ToListAsync();
        }

        // GET: api/Reviews/ByMovie/{movieId}
        [HttpGet("ByMovie/{movieId}")]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviewsByMovie(int movieId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.MovieID == movieId)
                .ToListAsync();
            return reviews;
        }

        // GET: api/Reviews/WithCountry
        [HttpGet("WithCountry")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllReviewsWithCountry()
        {
            var reviews = await _context.Reviews
                .Select(r => new {
                    r.ReviewID,
                    r.UserID,
                    r.MovieID,
                    r.Rating,
                    r.ReviewText,
                    r.ReviewDate,
                    userCountry = _context.Users.Where(u => u.UserID == r.UserID).Select(u => u.Country).FirstOrDefault()
                })
                .ToListAsync();
            return Ok(reviews);
        }

        // GET: api/Reviews/CountryPercentages/{movieId}
        [HttpGet("CountryPercentages/{movieId}")]
        public async Task<IActionResult> GetCountryPercentages(int movieId)
        {
            var validCountries = new[] { "US", "UK", "TR", "DE", "CA" };
            var userCountries = await _context.Reviews
                .Where(r => r.MovieID == movieId)
                .Join(_context.Users, r => r.UserID, u => u.UserID, (r, u) => u.Country)
                .Where(c => validCountries.Contains(c))
                .ToListAsync();

            var total = userCountries.Count;
            var countryCounts = userCountries
                .GroupBy(c => c)
                .ToDictionary(g => g.Key, g => g.Count());

            var result = validCountries.ToDictionary(
                c => c,
                c => new {
                    percentage = total == 0 ? 0 : (int)Math.Round(countryCounts.GetValueOrDefault(c, 0) * 100.0 / total),
                    count = countryCounts.GetValueOrDefault(c, 0)
                }
            );

            return Ok(result);
        }

        // POST: api/Reviews
        [HttpPost]
        public async Task<IActionResult> PostReview([FromBody] ReviewRequest request)
        {
            var review = new Review
            {
                UserID = request.UserID,
                MovieID = request.MovieID,
                Rating = request.Rating,
                ReviewText = request.ReviewText,
                ReviewDate = DateTime.UtcNow
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            // Movie'nin ortalama puanını güncelle
            var movie = await _context.Movies.FindAsync(review.MovieID);
            if (movie != null)
            {
                var avgRating = await _context.Reviews
                    .Where(r => r.MovieID == review.MovieID)
                    .AverageAsync(r => r.Rating);
                movie.Rating = avgRating;
                await _context.SaveChangesAsync();
            }

            return Ok(new {
                review.ReviewID,
                review.UserID,
                review.MovieID,
                review.Rating,
                review.ReviewText,
                review.ReviewDate
            });
        }
    }
} 