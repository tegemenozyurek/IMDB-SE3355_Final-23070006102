using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace imdb_web_api.Models
{
    [Table("Movies")]
    public class Movie
    {
        [Key]
        public int MovieID { get; set; }

        [Required, MaxLength(255)]
        public string Title { get; set; }

        [Required]
        public int Duration { get; set; }

        [Range(0, 10)]
        public double? Rating { get; set; }

        [MaxLength(500)]
        public string? Cover { get; set; }

        [MaxLength(500)]
        public string? Trailer { get; set; }

        public ICollection<Review> Reviews { get; set; }
        public ICollection<Watchlist> Watchlists { get; set; }
        public ICollection<MovieActor> MovieActors { get; set; }
    }
} 