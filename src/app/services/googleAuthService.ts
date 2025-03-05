import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../environments/environment';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  UserCredential,
} from 'firebase/auth';
import { initializeFirebase, firebaseAuth } from '../../app/firebase-config';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private authService: AuthService) {
    initializeFirebase().then(() => {
      console.log('Firebase has been initialized in GoogleAuthService');
    });
  }

  async signInWithGoogle(): Promise<void> {
    const auth = firebaseAuth;
    const provider = new GoogleAuthProvider();

    try {
      const result: UserCredential = await signInWithPopup(auth, provider);

      const user = result.user;

      const firebaseToken = await user.getIdToken();

      const response = await this.http
        .post<any>(
          this.apiUrl,
          { firebaseToken },
          { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
        )
        .toPromise();

      if (response && response.token) {
        this.authService.saveToken(response.token);
      } else {
        console.warn('Nu am primit un token valid de la backend.');
      }
    } catch (error) {
      console.error('Error during Google sign-in:', error);
      throw error;
    }
  }
  login(firebaseToken: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { firebaseToken });
  }
}
