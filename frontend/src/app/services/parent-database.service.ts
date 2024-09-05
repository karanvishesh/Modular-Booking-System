import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { JsonResponse } from "../models/json-response.model"
import { DatabaseModel } from '../models/databse.model';

@Injectable({
  providedIn: 'root',
})
export class ParentDatabaseService {
  // private apiUrl = 'http://localhost:8000/db-management-service/api/v1/db';
  private apiUrl = 'https://database-management-service.onrender.com/api/v1/db';

  constructor(private http: HttpClient) {}

  createDatabase(dbData : DatabaseModel): Observable<any> {
    return this.http
      .post(
        `${this.apiUrl}/create-database`,
        dbData
      )
      .pipe(
        tap((res : any) => {
        }),
        catchError(this.handleError)
      );
  }

  getDatabases(): Observable<JsonResponse<DatabaseModel[]>> {
    return this.http
      .get<JsonResponse<DatabaseModel[]>>(`${this.apiUrl}`)
      .pipe(
        tap((res : any) => {
        }),
        catchError(this.handleError)
      );
  }

  getDatabaseById(databaseId: string): Observable<JsonResponse<DatabaseModel>> {
    return this.http
      .get<JsonResponse<DatabaseModel>>(`${this.apiUrl}/${databaseId}`)
      .pipe(
        tap((res : any) => {
        }),
        catchError(this.handleError)
      );
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
