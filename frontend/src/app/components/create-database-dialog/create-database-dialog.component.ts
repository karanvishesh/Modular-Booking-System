import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastService } from '../../services/toast.service';
import { FormsModule } from '@angular/forms';
import { ParentDatabaseService } from '../../services/parent-database.service';
import { DatabaseModel } from '../../models/databse.model';

@Component({
  selector: 'app-create-database-dialog',
  templateUrl: './create-database-dialog.component.html',
  standalone: true,
  imports: [FormsModule],
})
export class CreateDatabaseDialogComponent {
  databaseName: string = '';
  bookerEntityName: string = '';
  bookableEntityName: string = '';
  availableBookings: number = 0;
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CreateDatabaseDialogComponent>,
    private toastService: ToastService,
    private parentDatabaseService: ParentDatabaseService
  ) {}

  onSubmit() {
    this.loading = true;
    this.toastService.show('Creating database...');
    const db: DatabaseModel = {
      databaseName: this.databaseName,
      bookerEntityName: this.bookerEntityName,
      bookableEntityName: this.bookableEntityName,
      availableBookings: this.availableBookings,
    };
    this.parentDatabaseService.createDatabase(db).subscribe(
      () => {
        this.toastService.show('Database Created');
        this.loading = false; // Stop the loader after success
        this.dialogRef.close();
      },
      (error) => {
        this.toastService.show('Error creating database');
        this.loading = false;
      }
    );
  }
}
