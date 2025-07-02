using Microsoft.EntityFrameworkCore;

namespace imdb_web_api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // Burada gelecekte entity'lerinizi tanımlayabilirsiniz
        // Örnek: public DbSet<Movie> Movies { get; set; }
        public DbSet<imdb_web_api.Models.User> Users { get; set; }
        public DbSet<imdb_web_api.Models.Movie> Movies { get; set; }
        public DbSet<imdb_web_api.Models.Review> Reviews { get; set; }
        public DbSet<imdb_web_api.Models.Watchlist> Watchlists { get; set; }
        public DbSet<imdb_web_api.Models.Actor> Actors { get; set; }
        public DbSet<imdb_web_api.Models.MovieActor> MovieActors { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<imdb_web_api.Models.Watchlist>()
                .HasKey(w => new { w.UserID, w.MovieID });

            modelBuilder.Entity<imdb_web_api.Models.MovieActor>()
                .HasKey(ma => new { ma.MovieID, ma.ActorID });

            modelBuilder.Entity<imdb_web_api.Models.Review>()
                .Property(r => r.ReviewDate)
                .HasDefaultValueSql("GETDATE()");

            modelBuilder.Entity<imdb_web_api.Models.Watchlist>()
                .Property(w => w.AddedAt)
                .HasDefaultValueSql("GETDATE()");
        }
    }
} 