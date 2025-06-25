import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User, LoginCredentials, RegisterCredentials, AuthResponse, Country } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Demo kullanıcı
  private users: User[] = [
    {
      id: 1,
      username: 'user',
      email: 'user@imdb.com',
      name: 'Demo',
      surname: 'User',
      country: 'United States',
      city: 'New York'
    }
  ];

  // Ülke ve şehir verileri
  private countries: Country[] = [
    {
      code: 'US',
      name: 'United States',
      cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose']
    },
    {
      code: 'GB',
      name: 'United Kingdom',
      cities: ['London', 'Birmingham', 'Leeds', 'Glasgow', 'Sheffield', 'Bradford', 'Edinburgh', 'Liverpool', 'Manchester', 'Bristol']
    },
    {
      code: 'DE',
      name: 'Germany',
      cities: ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig']
    },
    {
      code: 'FR',
      name: 'France',
      cities: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille']
    },
    {
      code: 'IT',
      name: 'Italy',
      cities: ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence', 'Bari', 'Catania']
    },
    {
      code: 'ES',
      name: 'Spain',
      cities: ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Málaga', 'Murcia', 'Palma', 'Las Palmas', 'Bilbao']
    },
    {
      code: 'CA',
      name: 'Canada',
      cities: ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener']
    },
    {
      code: 'AU',
      name: 'Australia',
      cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Newcastle', 'Canberra', 'Sunshine Coast', 'Wollongong']
    },
    {
      code: 'JP',
      name: 'Japan',
      cities: ['Tokyo', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe', 'Kyoto', 'Kawasaki', 'Saitama']
    },
    {
      code: 'TR',
      name: 'Turkey',
      cities: ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep', 'Mersin', 'Diyarbakir']
    }
  ];

  constructor() {
    // Local storage'dan kullanıcı bilgisini kontrol et
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(credentials: LoginCredentials): Observable<AuthResponse | null> {
    // Demo login - gerçek uygulamada API çağrısı yapılır
    const user = this.users.find(u => 
      u.username === credentials.username && 
      credentials.password === '123456' // Demo şifre
    );

    if (user) {
      const response: AuthResponse = {
        user: user,
        token: 'demo-token-' + Date.now()
      };

      // Kullanıcı bilgisini kaydet
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('authToken', response.token);
      this.currentUserSubject.next(user);

      return of(response);
    }

    return of(null);
  }

  register(credentials: RegisterCredentials): Observable<AuthResponse | null> {
    // Şifre kontrolü
    if (credentials.password !== credentials.repassword) {
      return of(null);
    }

    // Email kontrolü
    const existingUser = this.users.find(u => u.email === credentials.email);
    if (existingUser) {
      return of(null);
    }

    // Yeni kullanıcı oluştur
    const newUser: User = {
      id: this.users.length + 1,
      username: credentials.email.split('@')[0], // Email'den username oluştur
      email: credentials.email,
      name: credentials.name,
      surname: credentials.surname,
      country: credentials.country,
      city: credentials.city
    };

    this.users.push(newUser);

    const response: AuthResponse = {
      user: newUser,
      token: 'demo-token-' + Date.now()
    };

    // Kullanıcı bilgisini kaydet
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    localStorage.setItem('authToken', response.token);
    this.currentUserSubject.next(newUser);

    return of(response);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getCountries(): Observable<Country[]> {
    return of(this.countries);
  }

  getCitiesByCountry(countryCode: string): Observable<string[]> {
    const country = this.countries.find(c => c.code === countryCode);
    return of(country ? country.cities : []);
  }
} 