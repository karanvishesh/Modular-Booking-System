import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { JsonResponse, AuthData } from '../models/json-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = 'https://modular-booking-system.onrender.com/api/v1/user';
  // private apiUrl = 'http://localhost:8000/auth-service/api/v1/user';

  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  private authStatusSubject = new BehaviorSubject<boolean>(false);
  authStatus$ = this.authStatusSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.checkInitialAuthStatus();
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/register`, {
        username,
        email,
        password,
      })
      .pipe(catchError(this.handleError));
  }

  login(
    username: string,
    password: string
  ): Observable<JsonResponse<AuthData> | null> {
    return this.http
      .post<JsonResponse<AuthData>>(`${this.apiUrl}/login`, {
        username,
        password,
      })
      .pipe(
        tap((response: any) => {
          this.userSubject.next(response.data!.user);
          this.authStatusSubject.next(true);
          localStorage.setItem('accessToken', response.data!.accessToken);
          this.router.navigate(['/home']);
        }),
        catchError(this.handleError)
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        this.userSubject.next(null);
        this.authStatusSubject.next(false);
        localStorage.removeItem('accessToken');
        this.router.navigate(['/login']);
      }),
      catchError(this.handleError)
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

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.status === 400) {
      errorMessage =
        error.error.message || 'Bad Request. Please check your input.';
    } else if (error.status === 401) {
      errorMessage =
        error.error.message || 'Unauthorized. Please check your credentials.';
    } else if (error.status === 403) {
      errorMessage =
        error.error.message ||
        'Forbidden. You do not have permission to access this resource.';
    } else if (error.status === 404) {
      errorMessage = error.error.message || 'Resource not found.';
    } else if (error.status === 500) {
      errorMessage =
        error.error.message || 'Internal Server Error. Please try again later.';
    } else if (error.status === 503) {
      errorMessage =
        error.error.message || 'Service Unavailable. Please try again later.';
    } else {
      errorMessage = error.error.message || 'An unknown error occurred!';
    }
    return throwError(() => new Error(errorMessage));
  }
}
