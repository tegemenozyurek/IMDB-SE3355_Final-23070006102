using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace imdb_web_api.Models
{
    [Table("MovieActors")]
    public class MovieActor
    {
        [Key, Column(Order = 0)]
        public int MovieID { get; set; }
        public Movie Movie { get; set; }

        [Key, Column(Order = 1)]
        public int ActorID { get; set; }
        public Actor Actor { get; set; }
    }
} 