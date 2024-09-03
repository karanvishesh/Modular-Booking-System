import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { JsonResponse, AuthData } from '../models/jsonresponse.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/booking-service/api/v1/user';
  private dbAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmQ1ZDg1YjEyMmYyYmQwM2RjN2I0MTEiLCJkYXRhYmFzZU5hbWUiOiJNb3ZpZV9Cb29raW5nX1N5c3RlbSIsInVzZXJJZCI6IjY2ZDVkODNkYWExMDUzMTVjYTM0OWI3NSIsImlhdCI6MTcyNTI5MDU4N30.NAbAlO4F6eSO9rEDMM9S7SNbQ0Z-St51tFiOkTohOgM";
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  private authStatusSubject = new BehaviorSubject<boolean>(false);
  authStatus$ = this.authStatusSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.checkInitialAuthStatus();
  }

  register(username: string, email: string, password: string): Observable<any> {
    console.log(  {
      username,
      email,
      password,
    });
    return this.http.post(
      `${this.apiUrl}/register`,
      {
        username,
        email,
        password,
      },
      { withCredentials: true, headers: { 'Authorization': `Bearer ${this.dbAccessToken}` }},
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
        { withCredentials: true , headers: { 'Authorization': `Bearer ${this.dbAccessToken}` }}
      )
      .pipe(
        tap((response: any) => {
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
      .post(`${this.apiUrl}/logout`, {}, { withCredentials: true, headers: { 'Authorization': `Bearer ${this.dbAccessToken}` } })
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
