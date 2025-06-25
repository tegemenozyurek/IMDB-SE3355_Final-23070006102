import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCountries();
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

  onSubmit(): void {
    if (this.isGmailLogin) {
      this.handleGmailLogin();
      return;
    }

    if (this.isLoginMode) {
      this.handleLogin();
    } else {
      this.handleRegister();
    }
  }

  handleLogin(): void {
    if (!this.credentials.username || !this.credentials.password) {
      this.error = 'Username and password are required';
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