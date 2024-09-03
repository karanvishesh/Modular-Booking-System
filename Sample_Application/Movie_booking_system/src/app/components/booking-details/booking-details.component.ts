import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
})
export class BookingDetailsComponent implements OnInit {
  booking: any;

  constructor(
    private bookingService: BookingService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.bookingService.getSlotDetails(id!).subscribe(
      response => {
        this.booking = response.data;
      },
      error => {
        console.error('Failed to load booking details', error);
      }
    );
  }

  cancelBooking() {
    const id = this.route.snapshot.paramMap.get('id');
    this.bookingService.cancelBooking(id!).subscribe(
      response => {
        this.router.navigate(['/dashboard']);
      },
      error => {
        console.error('Failed to cancel booking', error);
      }
    );
  }

  updateBooking() {
    const id = this.route.snapshot.paramMap.get('id');
    const updatedData = {}; // Add the required update data here
    this.bookingService.updateBooking(id!, updatedData).subscribe(
      response => {
        this.router.navigate(['/dashboard']);
      },
      error => {
        console.error('Failed to update booking', error);
      }
    );
  }
}
