import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
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

  constructor() {}

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
}
