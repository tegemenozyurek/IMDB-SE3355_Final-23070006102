export interface Movie {
  id: number;
  title: string;
  director: string;
  year: number;
  rating: number;
  genre: string;
  description: string;
  posterUrl?: string;
  trailer?: string;
  releaseDate?: string;
  certificate?: string;
  duration?: string;
  backdrop?: string;
  ratingCount?: string;
  actors?: string[];
  plot?: string;
}

export interface MovieSearchParams {
  title?: string;
  director?: string;
  genre?: string;
  year?: number;
  minRating?: number;
}
