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
  private dbAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmQ1ZDg1YjEyMmYyYmQwM2RjN2I0MTEiLCJkYXRhYmFzZU5hbWUiOiJNb3ZpZV9Cb29raW5nX1N5c3RlbSIsInVzZXJJZCI6IjY2ZDVkODNkYWExMDUzMTVjYTM0OWI3NSIsImlhdCI6MTcyNTI5MDU4N30.NAbAlO4F6eSO9rEDMM9S7SNbQ0Z-St51tFiOkTohOgM";
  constructor(private http: HttpClient) {}

  getAllSlots(): Observable<JsonResponse<Slots[]> | null> {
    return this.http.get<JsonResponse<Slots[]> | null>(`${this.apiUrl}/entities`, {
      withCredentials: true,
      headers: { 'Authorization': `Bearer ${this.dbAccessToken}` }
    });
  }

  getSlotDetails(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, {
      withCredentials: true,
      headers: { 'Authorization': `Bearer ${this.dbAccessToken}` }
    });
  }

  bookEntity(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/book`, data, {
      withCredentials: true,
      headers: { 'Authorization': `Bearer ${this.dbAccessToken}` }
    });
  }

  cancelBooking(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/cancel`, {}, {
      withCredentials: true,
      headers: { 'Authorization': `Bearer ${this.dbAccessToken}` }
    });
  }

  updateBooking(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, data, {
      withCredentials: true,
      headers: { 'Authorization': `Bearer ${this.dbAccessToken}` }
    });
  }
}
