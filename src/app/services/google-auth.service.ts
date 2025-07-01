import { Injectable } from '@angular/core';

declare global {
  interface Window {
    google: any;
    googleSignInCallback: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  // Demo Google OAuth Client ID - production'da gerçek client ID kullanın
  private clientId = '664448925226-k2r9i7uh1etn58fh1q5qacftbobqe41g.apps.googleusercontent.com';
  private isGoogleLoaded = false;

  constructor() {
    this.loadGoogleScript();
  }

  private loadGoogleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isGoogleLoaded) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.isGoogleLoaded = true;
        this.initializeGoogleSignIn();
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  private initializeGoogleSignIn(): void {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: this.clientId,
        callback: this.handleCredentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true
      });
    }
  }

  private handleCredentialResponse(response: any): void {
    console.log('Google credential response:', response);

    // Decode the JWT token to get user info
    const token = response.credential;
    const payload = this.parseJWT(token);

    console.log('User info:', payload);

    // Store user data and redirect
    if (payload) {
      const userData = {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        googleId: payload.sub
      };

      localStorage.setItem('currentUser', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');

      // Trigger custom event for app component to handle
      window.dispatchEvent(new CustomEvent('googleSignInSuccess', {
        detail: userData
      }));
    }
  }

  private parseJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  }

  public signInWithGoogle(): Promise<void> {
    return new Promise((resolve) => {
      // Simulate Google sign-in with demo user
      console.log('Simulating Google Sign-In...');

      const demoGoogleUser = {
        email: 'demo.user@gmail.com',
        name: 'Demo User',
        picture: 'https://via.placeholder.com/150',
        sub: 'demo-google-id-123'
      };

      // Simulate a 1-second delay for realistic UX
      setTimeout(() => {
        console.log('Google Sign-In simulation complete');

        // Store user data
        localStorage.setItem('currentUser', JSON.stringify(demoGoogleUser));
        localStorage.setItem('isAuthenticated', 'true');

        // Trigger custom event for app component
        window.dispatchEvent(new CustomEvent('googleSignInSuccess', {
          detail: demoGoogleUser
        }));

        resolve();
      }, 1000);
    });
  }

  private promptGoogleSignIn(): void {
    // Simulate Google OAuth for demo purposes
    this.simulateGoogleSignIn();
  }

  private simulateGoogleSignIn(): void {
    // Demo simulation - in production, use real Google OAuth
    const demoGoogleUser = {
      email: 'demo.user@gmail.com',
      name: 'Demo User',
      picture: 'https://via.placeholder.com/150',
      sub: 'demo-google-id-123'
    };

    // Trigger the success event after a short delay to simulate OAuth flow
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('googleSignInSuccess', {
        detail: demoGoogleUser
      }));
    }, 1000);
  }

  private showGoogleOneTap(): void {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          text: 'signin_with',
          width: '300'
        }
      );
    }
  }

  public signOut(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    console.log('Google Sign-Out complete');
  }
}
