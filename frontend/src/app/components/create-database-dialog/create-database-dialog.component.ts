import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastService } from '../../services/toast.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ParentDatabaseService } from '../../services/parent-database.service';
import { DatabaseModel } from '../../models/databse.model';
import { mongodbNameValidator } from '../../utils/mongodbname.validator';

@Component({
  selector: 'app-create-database-dialog',
  templateUrl: './create-database-dialog.component.html',
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class CreateDatabaseDialogComponent {
  dbCreationForm: FormGroup | undefined;
  loading: boolean = false;
  index = 2;

  constructor(
    public dialogRef: MatDialogRef<CreateDatabaseDialogComponent>,
    private toastService: ToastService,
    private parentDatabaseService: ParentDatabaseService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.dbCreationForm = this.formBuilder.group({
      databaseName: ['', [Validators.required, mongodbNameValidator]],
      level1Entity: ['', [Validators.required]],
    });
  }

  getControlNames(): string[] {
    var res = Object.keys(this.dbCreationForm?.controls || {});
    return res.slice(2);
  }

  addLevel() {
    this.dbCreationForm?.addControl(
      `level${this.index}Entity`,
      this.formBuilder.control('', Validators.required)
    );
    this.index++;
  }

  getPlaceholder(control: string) {
    switch (control) {
      case 'level2Entity':
        return 'Enter Level 2 Entity (for eg Screen, Parking Floor)';
      case 'level3Entity':
        return 'Enter Level 3 Entity (for eg Seats, Parking Spot)';
      default:
        return 'Enter value';
    }
  }
  getLabelName(control: string) {
    control = control.charAt(0).toUpperCase() + control.slice(1);
    let formatted = control.replace(/(\D)(\d)/g, '$1 $2 ');
    return formatted;
  }
  onSubmit() {
    this.loading = true;
    this.toastService.show('Creating database...');
    const db: DatabaseModel = {
      databaseName: this.dbCreationForm!.value.databaseName,
      child : {name : this.dbCreationForm?.value.level1Entity, count:2}
    };
    let currDb = db.child!;
    this.getControlNames().map(ele => {
      currDb.child = {name : this.dbCreationForm?.value[ele], count : 100}  
      currDb = currDb.child;
  })
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
