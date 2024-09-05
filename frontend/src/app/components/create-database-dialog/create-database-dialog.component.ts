import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastService } from '../../services/toast.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ParentDatabaseService } from '../../services/parent-database.service';
import { DatabaseModel } from '../../models/databse.model';

@Component({
  selector: 'app-create-database-dialog',
  templateUrl: './create-database-dialog.component.html',
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class CreateDatabaseDialogComponent {
  dbCreationForm: FormGroup | undefined;
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CreateDatabaseDialogComponent>,
    private toastService: ToastService,
    private parentDatabaseService: ParentDatabaseService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.dbCreationForm = this.formBuilder.group({
      databaseName: ['', Validators.required],
      bookerEntityName: ['', Validators.required],
      bookableEntityName: ['', Validators.required],
      availableBookings: [0, Validators.required],
    });
  }

  onSubmit() {
    this.loading = true;
    this.toastService.show('Creating database...');
    const db: DatabaseModel = {
      databaseName: this.dbCreationForm!.value.databaseName,
      bookerEntityName: this.dbCreationForm!.value.bookerEntityName,
      bookableEntityName: this.dbCreationForm!.value.bookableEntityName,
      availableBookings: this.dbCreationForm!.value.availableBookings,
    };
    this.parentDatabaseService.createDatabase(db).subscribe({
      next: () => {
        this.toastService.show('Database Created');
        this.loading = false;
        this.dialogRef.close();
      },
      error: (error: any) => {
        this.toastService.show(error.message, 6000);
        this.loading = false;
      },
    });
  }
}
