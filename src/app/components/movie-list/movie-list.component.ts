import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  loading = false;
  error = '';

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.loading = true;
    this.error = '';
    
    this.movieService.getAllMovies().subscribe({
      next: (movies) => {
        this.movies = movies;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Filmler yüklenirken hata oluştu';
        this.loading = false;
        console.error('Error loading movies:', error);
      }
    });
  }

  deleteMovie(id: number): void {
    if (confirm('Bu filmi silmek istediğinizden emin misiniz?')) {
      this.movieService.deleteMovie(id).subscribe({
        next: (success) => {
          if (success) {
            this.movies = this.movies.filter(m => m.id !== id);
          }
        },
        error: (error) => {
          console.error('Error deleting movie:', error);
        }
      });
    }
  }
} 