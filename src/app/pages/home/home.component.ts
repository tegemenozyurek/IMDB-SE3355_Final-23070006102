import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('movieGrid', { static: false }) movieGrid!: ElementRef;

  currentIndex = 0;
  maxIndex = 9; // 10 cards total (0-9)
  autoSlideInterval: any;
  isManuallyControlled = false;
  resumeTimeout: any;
  showTrailerModal = false;
  currentTrailerId = '';
  safeTrailerUrl: SafeResourceUrl | null = null;
  showMovieModal = false;
  selectedMovie: any = null;

  // Pro modal state
  showProModal = false;

  // Review modal state
  showReviewModal = false;
  userRating = 0;
  hoveredRating = 0;
  userReviewText = '';

  constructor(private sanitizer: DomSanitizer, private authService: AuthService) {}

  // Movie data
  movies = [
    {
      id: 1,
      title: '3 Body Problem',
      year: 2024,
      certificate: 'TV-MA',
      duration: '1h 55m',
      rating: 7.7,
      ratingCount: '14K',
      genre: ['Sci-Fi', 'Drama', 'Mystery'],
      director: 'David Benioff, D.B. Weiss',
      actors: ['Jovan Adepo', 'Liam Cunningham', 'Eiza González'],
      plot: 'A fateful decision in 1960s China echoes across space and time to a group of scientists in the present, forcing them to face humanity\'s greatest threat.',
      description: 'FROM THE CREATORS OF GAME OF THRONES',
      poster: 'https://dnm.nflximg.net/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABXmTGsNNF7givL2uVSqriqrcOq4lU5uMs-on1XxwI0wbkYLbnHfkyo9pErJRLjqafCx3N-YrY4iTnIAr6W5vVUk0gNLw34dZBKc9bDmqnIOdOsYRRVxisjghALvuXgPtuPIhWQ.jpg?r=f47',
      backdrop: 'https://dnm.nflximg.net/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABXmTGsNNF7givL2uVSqriqrcOq4lU5uMs-on1XxwI0wbkYLbnHfkyo9pErJRLjqafCx3N-YrY4iTnIAr6W5vVUk0gNLw34dZBKc9bDmqnIOdOsYRRVxisjghALvuXgPtuPIhWQ.jpg?r=f47',
      trailer: 'SdvzhCL7vIA',
      releaseDate: 'March 21',
      platform: 'Netflix'
    },
    {
      id: 2,
      title: 'The Idea of You',
      year: 2024,
      certificate: 'R',
      duration: '1h 55m',
      rating: 6.6,
      ratingCount: '14K',
      genre: ['Romance', 'Drama'],
      director: 'Michael Showalter',
      actors: ['Anne Hathaway', 'Nicholas Galitzine'],
      plot: 'A 40-year-old single mom meets a member of a popular boy band at Coachella and begins an unexpected romance.',
      description: 'BASED ON THE ACCLAIMED NOVEL',
      poster: 'https://m.media-amazon.com/images/M/MV5BNGFlYWQzNTQtZjI0OS00MDgyLTk1NzMtMDcxZjhjZTI2M2Q1XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_FMjpg_UX1000_.jpg',
      backdrop: 'https://m.media-amazon.com/images/M/MV5BNGFlYWQzNTQtZjI0OS00MDgyLTk1NzMtMDcxZjhjZTI2M2Q1XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_FMjpg_UX1000_.jpg',
      trailer: 'example123',
      releaseDate: 'May 2',
      platform: 'Prime Video'
    }
  ];

  ngAfterViewInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
    if (this.resumeTimeout) {
      clearTimeout(this.resumeTimeout);
    }
  }

  startAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }

    this.autoSlideInterval = setInterval(() => {
      if (!this.isManuallyControlled) {
        this.nextSlide();
      }
    }, 3000); // Change slide every 3 seconds
  }

  stopAutoSlide() {
    this.isManuallyControlled = true;
    if (this.resumeTimeout) {
      clearTimeout(this.resumeTimeout);
    }

    // Resume auto slide after 5 seconds of no manual interaction
    this.resumeTimeout = setTimeout(() => {
      this.isManuallyControlled = false;
    }, 5000);
  }

  nextSlide() {
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // Loop back to start
    }
    this.updateSliderPosition();
  }

  prevSlide() {
    this.stopAutoSlide();
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.maxIndex; // Loop to end
    }
    this.updateSliderPosition();
  }

  nextSlideManual() {
    this.stopAutoSlide();
    this.nextSlide();
  }

  updateSliderPosition() {
    if (this.movieGrid) {
      const cardWidth = this.getCardWidth();
      const gap = this.getGap();
      const translateX = -(this.currentIndex * (cardWidth + gap));
      this.movieGrid.nativeElement.style.transform = `translateX(${translateX}px)`;
      this.movieGrid.nativeElement.style.transition = 'transform 0.5s ease-in-out';
    }
  }

  private getCardWidth(): number {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 480) return 140;
    if (screenWidth <= 768) return 160;
    if (screenWidth <= 1200) return 200;
    return 240;
  }

  private getGap(): number {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 480) return 12;
    return 16;
  }

  goToSlide(index: number) {
    this.stopAutoSlide();
    this.currentIndex = index;
    this.updateSliderPosition();
  }

  openTrailer(videoId: string) {
    this.currentTrailerId = videoId;
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    this.safeTrailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    this.showTrailerModal = true;
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  closeTrailer() {
    this.showTrailerModal = false;
    this.currentTrailerId = '';
    this.safeTrailerUrl = null;
    document.body.style.overflow = 'auto'; // Restore scrolling
  }

  openMovieModal(movieTitle: string) {
    const movie = this.movies.find(m => m.title === movieTitle);
    if (movie) {
      this.selectedMovie = movie;
      this.showMovieModal = true;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }
  }

  closeMovieModal() {
    this.showMovieModal = false;
    this.selectedMovie = null;
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
  }

  playTrailerFromModal() {
    if (this.selectedMovie && this.selectedMovie.trailer) {
      // Close movie modal first
      this.showMovieModal = false;
      // Small delay to ensure modal is closed before opening trailer
      setTimeout(() => {
        this.openTrailer(this.selectedMovie.trailer);
      }, 100);
    }
  }

  // Pro modal methods
  openProModal() {
    this.showProModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeProModal() {
    this.showProModal = false;
    document.body.style.overflow = 'auto';
  }

  // Review modal methods
  openReviewModal() {
    // Close movie modal first
    this.closeMovieModal();

    // Then open review modal
    this.showReviewModal = true;
    this.userRating = 0;
    this.hoveredRating = 0;
    this.userReviewText = '';
    document.body.style.overflow = 'hidden';
  }

  closeReviewModal() {
    this.showReviewModal = false;
    document.body.style.overflow = 'auto';
  }

  setRating(rating: number) {
    this.userRating = rating;
  }

  hoverRating(rating: number) {
    this.hoveredRating = rating;
  }

  unhoverRating() {
    this.hoveredRating = 0;
  }

    submitReview() {
    if (this.userRating > 0 && this.userReviewText.trim()) {
      // Here you would typically send the review to your backend
      console.log('Review submitted:', {
        movie: this.selectedMovie.title,
        rating: this.userRating,
        review: this.userReviewText
      });

            // Show success message (you could implement a toast notification)
      alert('Thank you for your review!');

      // Close review modal
      this.closeReviewModal();
    }
  }
}
