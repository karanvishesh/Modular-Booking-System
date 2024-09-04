import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
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
        tap((res) => {
          console.log(res);
        }),
        catchError((error) => {
          this.handleError(error);
          return of(null);
        })
      );
  }

  getDatabases(): Observable<JsonResponse<DatabaseModel[]>> {
    return this.http
      .get<JsonResponse<DatabaseModel[]>>(`${this.apiUrl}`)
      .pipe(
        tap((res) => {
          console.log('Databases retrieved:', res);
        }),
        catchError((error) => {
          this.handleError(error);
          return of({
            statusCode: 500,
            message: 'An error occurred',
            data: [],
            success : false
          });
        })
      );
  }

  getDatabaseById(databaseId: string): Observable<JsonResponse<DatabaseModel>> {
    return this.http
      .get<JsonResponse<DatabaseModel>>(`${this.apiUrl}/${databaseId}`)
      .pipe(
        tap((res : any) => {
        }),
        catchError((error) => {
          this.handleError(error);
          return of({
            statusCode: 500,
            message: 'An error occurred',
            success: false
          });
        })
      );
  }

  private handleError(error: any): void {
    console.error('An error occurred:', error);
  }
}
