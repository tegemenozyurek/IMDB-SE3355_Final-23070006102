import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Movie, MovieSearchParams } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private movies: Movie[] = [
    {
      id: 1,
      title: 'The Shawshank Redemption',
      director: 'Frank Darabont',
      year: 1994,
      rating: 9.3,
      genre: 'Drama',
      description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
      posterUrl: 'https://example.com/shawshank.jpg'
    },
    {
      id: 2,
      title: 'The Godfather',
      director: 'Francis Ford Coppola',
      year: 1972,
      rating: 9.2,
      genre: 'Crime',
      description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
      posterUrl: 'https://example.com/godfather.jpg'
    },
    {
      id: 3,
      title: 'Pulp Fiction',
      director: 'Quentin Tarantino',
      year: 1994,
      rating: 8.9,
      genre: 'Crime',
      description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
      posterUrl: 'https://example.com/pulp-fiction.jpg'
    }
  ];

  constructor() { }

  // Tüm filmleri getir
  getAllMovies(): Observable<Movie[]> {
    return of(this.movies);
  }

  // ID'ye göre film getir
  getMovieById(id: number): Observable<Movie | undefined> {
    const movie = this.movies.find(m => m.id === id);
    return of(movie);
  }

  // Film ara
  searchMovies(params: MovieSearchParams): Observable<Movie[]> {
    let filteredMovies = [...this.movies];

    if (params.title) {
      filteredMovies = filteredMovies.filter(m => 
        m.title.toLowerCase().includes(params.title!.toLowerCase())
      );
    }

    if (params.director) {
      filteredMovies = filteredMovies.filter(m => 
        m.director.toLowerCase().includes(params.director!.toLowerCase())
      );
    }

    if (params.genre) {
      filteredMovies = filteredMovies.filter(m => 
        m.genre.toLowerCase() === params.genre!.toLowerCase()
      );
    }

    if (params.year) {
      filteredMovies = filteredMovies.filter(m => m.year === params.year);
    }

    if (params.minRating) {
      filteredMovies = filteredMovies.filter(m => m.rating >= params.minRating!);
    }

    return of(filteredMovies);
  }

  // Yeni film ekle
  addMovie(movie: Omit<Movie, 'id'>): Observable<Movie> {
    const newMovie: Movie = {
      ...movie,
      id: Math.max(...this.movies.map(m => m.id)) + 1
    };
    this.movies.push(newMovie);
    return of(newMovie);
  }

  // Film güncelle
  updateMovie(id: number, movie: Partial<Movie>): Observable<Movie | undefined> {
    const index = this.movies.findIndex(m => m.id === id);
    if (index !== -1) {
      this.movies[index] = { ...this.movies[index], ...movie };
      return of(this.movies[index]);
    }
    return of(undefined);
  }

  // Film sil
  deleteMovie(id: number): Observable<boolean> {
    const index = this.movies.findIndex(m => m.id === id);
    if (index !== -1) {
      this.movies.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  // Tüm türleri getir
  getGenres(): Observable<string[]> {
    const genres = [...new Set(this.movies.map(m => m.genre))];
    return of(genres);
  }
} 