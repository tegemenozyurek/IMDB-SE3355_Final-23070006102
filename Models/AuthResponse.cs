namespace imdb_web_api.Models
{
    public class AuthResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public User? User { get; set; }
        public string? Token { get; set; }
    }
} 