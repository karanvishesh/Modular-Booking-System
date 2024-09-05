import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Slots } from '../models/booking.model';
import { JsonResponse } from '../models/jsonresponse.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:8000/booking-service/api/v1/booking';
  private dbAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmQ5YWE1NDM1ODBiN2RjZWM1YWUzYmUiLCJkYXRhYmFzZU5hbWUiOiJtb3ZpZV9ib29raW5nIiwidXNlcklkIjoiNjZkOWFhMzJiMDM3YjFjYTRjZmQ2NjVjIiwiaWF0IjoxNzI1NTQwOTQ4fQ.jPEzdSkowOGYTU-I6CIOTC_atWJj7gjD4OQ_Bi7LMwM';
  constructor(private http: HttpClient) {}

  getAllSlots(): Observable<JsonResponse<Slots[]> | null> {
    return this.http.get<JsonResponse<Slots[]> | null>(`${this.apiUrl}/entities`, {
      headers: { 'Authorization': `Bearer ${this.dbAccessToken}` }
    });
  }

  getSlotDetails(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, {
      headers: { 'Authorization': `Bearer ${this.dbAccessToken}` }
    });
  }

  bookEntity(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/book`, data, {
      headers: { 'Authorization': `Bearer ${this.dbAccessToken}` }
    });
  }

  cancelBooking(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/cancel`, {}, {
      headers: { 'Authorization': `Bearer ${this.dbAccessToken}` }
    });
  }

  updateBooking(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, data, {
      headers: { 'Authorization': `Bearer ${this.dbAccessToken}` }
    });
  }
}
