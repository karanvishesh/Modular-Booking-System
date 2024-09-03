import { Component, Inject, Input } from '@angular/core';
import { Slots } from '../../models/booking.model';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-book-dialog',
  standalone: true,
  imports: [FormsModule,MatDialogModule],
  templateUrl: './book-dialog.component.html',
  styleUrl: './book-dialog.component.css'
})
export class BookDialogComponent {
    slot:Slots;
    startTime: string = '';
    endTime: string = '';
  constructor(@Inject(MAT_DIALOG_DATA) public data: { slot: Slots }, private bookingService : BookingService, public dialogRef: MatDialogRef<BookDialogComponent>) {
    this.slot = data.slot;  // Assign the passed slot to the component's slot property
  }

  onSubmit() {
    this.bookingService.bookEntity(
      {
        bookableEntityId : this.slot._id,
        startTime : this.startTime,
        endTime : this.endTime
      }
    ).subscribe((res: any) =>  this.dialogRef.close());
  }
}
