import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Slots } from '../../models/booking.model';
import { Subject, takeUntil } from 'rxjs';
import { BookDialogComponent } from '../book-dialog/book-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  styleUrl: './dashboard.component.css',
  imports: [CommonModule, MatDialogModule],
})
export class DashboardComponent implements OnInit {
  slots: Slots[] | undefined = [];
  private unsubscribe$ = new Subject<void>();

  constructor(
    private bookingService: BookingService,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getAllSlots();
  }

  getAllSlots() {
    this.bookingService.getAllSlots().subscribe(
      (response) => {
        this.slots = response?.data;
      },
      (error) => {
        console.error('Failed to load bookings', error);
      }
    );
  }

  openBookingDialog(slot: Slots): void {
    const dialogRef = this.dialog.open(BookDialogComponent, {
      width: '500px',
      data: { slot: slot },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.getAllSlots();
      });
  }

  viewBooking(id: string) {
    this.router.navigate([`/booking/${id}`]);
  }

  logout(): void {
    this.authService.logout().subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
