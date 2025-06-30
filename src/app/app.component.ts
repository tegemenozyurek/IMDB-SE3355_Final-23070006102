import { Component, OnInit, HostListener } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { User, RegisterCredentials, Country } from './models/auth.model';
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'IMBD';
  currentUser: User | null = null;
  shouldShowNavbar = true;
  mobileMenuOpen = false;

  // Search dropdown properties
  isSearchDropdownOpen = false;
  selectedSearchCategory = 'All';

  // Sign In modal properties
  isSignInModalOpen = false;
  isRegisterModalOpen = false;
  isIMDbProModalOpen = false;

  // Register form properties
  registerCurrentStep = 1;
  registerData: RegisterCredentials = {
    name: '',
    surname: '',
    email: '',
    password: '',
    repassword: '',
    country: '',
    city: ''
  };

  countries: Country[] = [];
  cities: string[] = [];
  selectedCountryCode = '';
  registerError = '';
  registerLoading = false;

  constructor(private authService: AuthService, private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.shouldShowNavbar = event.url !== '/login';
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Load countries for register form
    this.authService.getCountries().subscribe(countries => {
      this.countries = countries;
    });
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.search-dropdown-container')) {
      this.isSearchDropdownOpen = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;

    // Prevent body scroll when menu is open
    if (this.mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  // Search dropdown methods
  toggleSearchDropdown(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    console.log('Dropdown clicked, current state:', this.isSearchDropdownOpen);
    this.isSearchDropdownOpen = !this.isSearchDropdownOpen;
    console.log('New dropdown state:', this.isSearchDropdownOpen);
  }

  selectSearchCategory(category: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    console.log('Category selected:', category);
    this.selectedSearchCategory = category;
    this.isSearchDropdownOpen = false;
  }

  // Sign In modal methods
  openSignInModal() {
    this.isSignInModalOpen = true;
  }

  closeSignInModal() {
    this.isSignInModalOpen = false;
  }

    openRegisterModal() {
    console.log('Opening register modal');
    this.isSignInModalOpen = false;
    this.isRegisterModalOpen = true;

    // Reset form data completely to prevent autocomplete
    this.registerCurrentStep = 1;
    this.registerData = {
      name: '',
      surname: '',
      email: '',
      password: '',
      repassword: '',
      country: '',
      city: ''
    };
    this.selectedCountryCode = '';
    this.cities = [];
    this.registerError = '';
    this.registerLoading = false;

    // Force clear the form inputs after a small delay to override autocomplete
    setTimeout(() => {
      const emailInput = document.querySelector('input[name="register-email"]') as HTMLInputElement;
      const passwordInput = document.querySelector('input[name="register-new-password"]') as HTMLInputElement;
      const confirmPasswordInput = document.querySelector('input[name="register-confirm-password"]') as HTMLInputElement;

      if (emailInput) emailInput.value = '';
      if (passwordInput) passwordInput.value = '';
      if (confirmPasswordInput) confirmPasswordInput.value = '';
    }, 50);

    console.log('Register modal opened, state:', this.isRegisterModalOpen);
  }

  closeRegisterModal() {
    console.log('Closing register modal');
    this.isRegisterModalOpen = false;
  }

  // IMDbPro modal methods
  openIMDbProModal() {
    this.isIMDbProModalOpen = true;
  }

  closeIMDbProModal() {
    this.isIMDbProModalOpen = false;
  }

  navigateToLogin() {
    this.closeSignInModal();
    this.router.navigate(['/login']);
  }

  navigateToRegister() {
    // Small delay to prevent modal conflicts
    setTimeout(() => {
      this.openRegisterModal();
    }, 10);
  }

  // Register modal methods
  registerNextStep() {
    if (this.validateRegisterStep()) {
      if (this.registerCurrentStep < 3) {
        this.registerCurrentStep++;
        this.registerError = '';
      } else {
        this.handleRegister();
      }
    }
  }

  registerPrevStep() {
    if (this.registerCurrentStep > 1) {
      this.registerCurrentStep--;
      this.registerError = '';
    }
  }

  validateRegisterStep(): boolean {
    switch (this.registerCurrentStep) {
      case 1:
        if (!this.registerData.name || !this.registerData.surname) {
          this.registerError = 'First name and last name are required';
          return false;
        }
        if (this.registerData.name.length < 2) {
          this.registerError = 'First name must be at least 2 characters';
          return false;
        }
        if (this.registerData.surname.length < 2) {
          this.registerError = 'Last name must be at least 2 characters';
          return false;
        }
        break;
      case 2:
        if (!this.registerData.email) {
          this.registerError = 'Email is required';
          return false;
        }
        if (!/\S+@\S+\.\S+/.test(this.registerData.email)) {
          this.registerError = 'Please enter a valid email address';
          return false;
        }
        if (!this.registerData.password || !this.registerData.repassword) {
          this.registerError = 'Password and confirm password are required';
          return false;
        }
        if (this.registerData.password !== this.registerData.repassword) {
          this.registerError = 'Passwords do not match';
          return false;
        }
        if (this.registerData.password.length < 6) {
          this.registerError = 'Password must be at least 6 characters long';
          return false;
        }
        break;
      case 3:
        if (!this.registerData.country || !this.registerData.city) {
          this.registerError = 'Country and city are required';
          return false;
        }
        break;
    }
    return true;
  }

  onRegisterCountryChange(countryCode: string) {
    this.selectedCountryCode = countryCode;
    this.registerData.country = this.countries.find(c => c.code === countryCode)?.name || '';
    this.registerData.city = '';

    this.authService.getCitiesByCountry(countryCode).subscribe(cities => {
      this.cities = cities;
    });
  }

  handleRegister() {
    this.registerLoading = true;
    this.registerError = '';

    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        this.registerLoading = false;
        if (response) {
          this.closeRegisterModal();
          this.router.navigate(['/home']);
        } else {
          this.registerError = 'Registration failed or email already exists';
        }
      },
      error: (error) => {
        this.registerLoading = false;
        this.registerError = 'An error occurred during registration';
        console.error('Register error:', error);
      }
    });
  }
}
