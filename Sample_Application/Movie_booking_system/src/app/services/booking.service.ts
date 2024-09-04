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
  private dbAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmQ4YzBhYTMzZTZhYzdmNzAyOGY0NWEiLCJkYXRhYmFzZU5hbWUiOiJNb3ZpZV9Cb29raW5nX1N5c3RlbSIsInVzZXJJZCI6IjY2ZDhjMDgzZTFlOWY3ZWFiOTU2MzAzNSIsImlhdCI6MTcyNTQ4MTEzMH0.NlC_cm2vGKLBt9dGB6LKZEUYd1tihRWYhRwrjHOUdqM";
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
