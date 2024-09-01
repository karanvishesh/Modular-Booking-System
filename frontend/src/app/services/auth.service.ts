import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { JsonResponse, AuthData } from '../models/jsonresponse.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/auth-service/api/v1/user';

  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  private authStatusSubject = new BehaviorSubject<boolean>(false);
  authStatus$ = this.authStatusSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.checkInitialAuthStatus();
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/register`,
      {
        username,
        email,
        password,
      },
      { withCredentials: true }
    );
  }

  login(
    username: string,
    password: string
  ): Observable<JsonResponse<AuthData> | null> {
    return this.http
      .post<JsonResponse<AuthData>>(
        `${this.apiUrl}/login`,
        {
          username,
          password,
        },
        { withCredentials: true }
      )
      .pipe(
        tap((response) => {
          this.userSubject.next(response.data!.user);
          this.authStatusSubject.next(true);
          localStorage.setItem('accessToken', response.data!.accessToken);
          this.router.navigate(['/home']);
        }),
        catchError((error) => {
          this.handleError(error);
          return of(null);
        })
      );
  }

  logout(): Observable<any> {
    console.log('logging out');
    return this.http
      .post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          console.log('logged out successfully');
          this.userSubject.next(null);
          this.authStatusSubject.next(false);
          localStorage.removeItem('accessToken');
          this.router.navigate(['/login']);
        }),
        catchError((error) => {
          this.handleError(error);
          return of(null);
        })
      );
  }

  isAuthenticated(): Observable<boolean> {
    return this.authStatus$;
  }

  getUserDetails(): Observable<any> {
    return this.user$;
  }

  private checkInitialAuthStatus(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
          this.authStatusSubject.next(true);
      } else {
        this.authStatusSubject.next(false);
      }
    }
  }

  private handleError(error: any): void {
    console.error('An error occurred:', error);
  }
}
