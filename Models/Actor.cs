using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace imdb_web_api.Models
{
    [Table("Actors")]
    public class Actor
    {
        [Key]
        public int ActorID { get; set; }

        [Required, MaxLength(255)]
        public string Name { get; set; }

        public ICollection<MovieActor> MovieActors { get; set; }
    }
} 