import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginCredentials, RegisterCredentials, Country } from '../../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoginMode = true;
  isGmailLogin = false;
  currentStep = 1; // For multi-step registration

  credentials: LoginCredentials = {
    username: '',
    password: ''
  };

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

  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCountries();

    // Check if we should start in register mode
    this.route.queryParams.subscribe(params => {
      if (params['mode'] === 'register') {
        this.isLoginMode = false;
        this.currentStep = 1;
      }
    });
  }

  loadCountries(): void {
    this.authService.getCountries().subscribe(countries => {
      this.countries = countries;
    });
  }

  onCountryChange(countryCode: string): void {
    this.selectedCountryCode = countryCode;
    this.registerData.country = this.countries.find(c => c.code === countryCode)?.name || '';
    this.registerData.city = '';

    this.authService.getCitiesByCountry(countryCode).subscribe(cities => {
      this.cities = cities;
    });
  }

  switchMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.currentStep = 1; // Reset to step 1 when switching modes
    this.error = '';
    this.loading = false;
  }

  switchToGmail(): void {
    this.isGmailLogin = true;
    this.error = '';
  }

  switchToNormal(): void {
    this.isGmailLogin = false;
    this.error = '';
  }

  // Multi-step navigation methods
  nextStep(): void {
    if (this.currentStep < 3) {
      if (this.validateCurrentStep()) {
        this.currentStep++;
        this.error = '';
      }
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.error = '';
    }
  }

  validateCurrentStep(): boolean {
    switch (this.currentStep) {
      case 1:
        // Step 1: Name and Surname
        if (!this.registerData.name || !this.registerData.surname) {
          this.error = 'First name and last name are required';
          return false;
        }
        if (this.registerData.name.length < 2) {
          this.error = 'First name must be at least 2 characters';
          return false;
        }
        if (this.registerData.surname.length < 2) {
          this.error = 'Last name must be at least 2 characters';
          return false;
        }
        break;
      case 2:
        // Step 2: Email, Password, Password Again
        if (!this.registerData.email) {
          this.error = 'Email is required';
          return false;
        }
        if (!/\S+@\S+\.\S+/.test(this.registerData.email)) {
          this.error = 'Please enter a valid email address';
          return false;
        }
        if (!this.registerData.password || !this.registerData.repassword) {
          this.error = 'Password and confirm password are required';
          return false;
        }
        if (this.registerData.password !== this.registerData.repassword) {
          this.error = 'Passwords do not match';
          return false;
        }
        if (this.registerData.password.length < 6) {
          this.error = 'Password must be at least 6 characters long';
          return false;
        }
        break;
      case 3:
        // Step 3: Country and City
        if (!this.registerData.country || !this.registerData.city) {
          this.error = 'Country and city are required';
          return false;
        }
        break;
    }
    return true;
  }

    onSubmit(): void {
    if (this.isGmailLogin) {
      this.handleGmailLogin();
      return;
    }

    if (this.isLoginMode) {
      this.handleLogin();
    } else {
      // Register mode
      if (this.currentStep < 3) {
        this.nextStep();
      } else {
        this.handleRegister();
      }
    }
  }

  handleLogin(): void {
    if (!this.credentials.username || !this.credentials.password) {
      this.error = 'Username and password are required';
      return;
    }

    // Temporary login credentials
    if (this.credentials.username === 'buse' && this.credentials.password === '12345') {
      this.loading = true;
      this.error = '';

      setTimeout(() => {
        this.loading = false;
        this.router.navigate(['/home']);
      }, 1000);
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.loading = false;
        if (response) {
          this.router.navigate(['/home']);
        } else {
          this.error = 'Invalid username or password';
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = 'An error occurred during login';
        console.error('Login error:', error);
      }
    });
  }

  handleRegister(): void {
    if (!this.registerData.name || !this.registerData.surname || !this.registerData.email ||
        !this.registerData.password || !this.registerData.repassword ||
        !this.registerData.country || !this.registerData.city) {
      this.error = 'All fields are required';
      return;
    }

    if (this.registerData.password !== this.registerData.repassword) {
      this.error = 'Passwords do not match';
      return;
    }

    if (this.registerData.password.length < 6) {
      this.error = 'Password must be at least 6 characters long';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        this.loading = false;
        if (response) {
          this.router.navigate(['/home']);
        } else {
          this.error = 'Registration failed or email already exists';
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = 'An error occurred during registration';
        console.error('Register error:', error);
      }
    });
  }

  handleGmailLogin(): void {
    // Demo Gmail girişi
    this.loading = true;
    this.error = '';

    setTimeout(() => {
      this.loading = false;
      // Demo kullanıcı ile giriş yap
      this.credentials = {
        username: 'user',
        password: '123456'
      };
      this.handleLogin();
    }, 2000);
  }
}
