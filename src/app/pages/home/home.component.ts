import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('movieGrid', { static: false }) movieGrid!: ElementRef;

  constructor() {}

  ngAfterViewInit() {
    // Initialize any animations or effects here
    // Removed the infinite scroll setup that was causing performance issues
  }

  private setupInfiniteScroll() {
    // Commented out the problematic code that was causing the page to freeze
    // const container = this.movieGrid.nativeElement;
    // const cards = container.children;

    // Clone all cards and append them for seamless loop
    // for (let i = 0; i < cards.length; i++) {
    //   const clone = cards[i].cloneNode(true);
    //   container.appendChild(clone);
    // }
  }
}
