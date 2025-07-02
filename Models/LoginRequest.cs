using System.ComponentModel.DataAnnotations;

namespace imdb_web_api.Models
{
    public class LoginRequest
    {
        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
} 