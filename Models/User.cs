using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace imdb_web_api.Models
{
    [Table("Users")]
    public class User
    {
        [Key]
        public int UserID { get; set; }

        [Required, MaxLength(100)]
        public string Name { get; set; }

        [Required, MaxLength(100)]
        public string Surname { get; set; }

        [Required, MaxLength(255)]
        public string Email { get; set; }

        [Required, MaxLength(255)]
        public string PasswordHash { get; set; }

        [Required, MaxLength(100)]
        public string Country { get; set; }

        [Required, MaxLength(100)]
        public string City { get; set; }

        public ICollection<Review> Reviews { get; set; }
        public ICollection<Watchlist> Watchlists { get; set; }
    }
} 