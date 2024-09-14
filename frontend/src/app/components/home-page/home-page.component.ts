import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateDatabaseDialogComponent } from '../create-database-dialog/create-database-dialog.component';
import { ParentDatabaseService } from '../../services/parent-database.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DatabaseModel } from '../../models/databse.model';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [FormsModule, MatDialogModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  databases: DatabaseModel[] = [];
  errorMessage: string = '';
  loading: boolean = true;
  loggingOut : boolean = false;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private parentDatabaseService: ParentDatabaseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchDatabases();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  logout(): void {
    this.loggingOut = true;
    this.authService.logout().subscribe(
      () => {
        this.loggingOut = false;
      }
    );
  }

  openCreateDatabaseDialog(): void {
    const dialogRef = this.dialog.open(CreateDatabaseDialogComponent, {
      width: '500px',
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.fetchDatabases();
      });
  }

  fetchDatabases(): void {
    this.loading = true;
    this.parentDatabaseService
      .getDatabases()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (response) => {
          if (response.success && response.data && response.data.length > 0) {
            this.databases = response.data;
            this.errorMessage = '';
          } else {
            this.errorMessage = 'You can create databases to start using the system.';
          }
          this.loading = false;
        },
        (error) => {
          this.errorMessage = 'An error occurred while fetching databases.';
          this.loading = false;
        }
      );
  }

  viewDatabase(database: DatabaseModel): void {
    this.router.navigate(['/database', database._id]);
  }
}
