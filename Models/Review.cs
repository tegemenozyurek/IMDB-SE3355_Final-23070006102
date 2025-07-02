using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace imdb_web_api.Models
{
    [Table("Reviews")]
    public class Review
    {
        [Key]
        public int ReviewID { get; set; }

        [Required]
        public int UserID { get; set; }
        public User User { get; set; }

        [Required]
        public int MovieID { get; set; }
        public Movie Movie { get; set; }

        [Range(1, 10)]
        public int Rating { get; set; }

        [Column("Review")]
        public string? ReviewText { get; set; }

        public DateTime ReviewDate { get; set; } = DateTime.UtcNow;
    }
} 