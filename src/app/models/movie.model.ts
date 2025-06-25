export interface Movie {
  id: number;
  title: string;
  director: string;
  year: number;
  rating: number;
  genre: string;
  description: string;
  posterUrl?: string;
}

export interface MovieSearchParams {
  title?: string;
  director?: string;
  genre?: string;
  year?: number;
  minRating?: number;
} 