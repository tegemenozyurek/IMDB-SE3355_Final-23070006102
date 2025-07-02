using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace imdb_web_api.Models
{
    [Table("Watchlist")]
    public class Watchlist
    {
        [Key, Column(Order = 0)]
        public int UserID { get; set; }
        public User User { get; set; }

        [Key, Column(Order = 1)]
        public int MovieID { get; set; }
        public Movie Movie { get; set; }

        public DateTime AddedAt { get; set; } = DateTime.UtcNow;
    }
} 