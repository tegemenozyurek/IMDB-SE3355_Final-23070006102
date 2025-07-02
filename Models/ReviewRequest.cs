namespace imdb_web_api.Models
{
    public class ReviewRequest
    {
        public int UserID { get; set; }
        public int MovieID { get; set; }
        public int Rating { get; set; }
        public string ReviewText { get; set; }
    }
} 