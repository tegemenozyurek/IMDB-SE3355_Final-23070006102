using System.ComponentModel.DataAnnotations;

namespace imdb_web_api.Models
{
    public class RegisterRequest
    {
        [Required, MaxLength(100)]
        public string Name { get; set; }

        [Required, MaxLength(100)]
        public string Surname { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        [Required, MinLength(6)]
        public string Password { get; set; }

        [Required, MaxLength(100)]
        public string Country { get; set; }

        [Required, MaxLength(100)]
        public string City { get; set; }
    }
} 