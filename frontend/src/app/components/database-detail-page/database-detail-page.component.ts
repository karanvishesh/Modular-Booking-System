import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParentDatabaseService } from '../../services/parent-database.service';
import { DatabaseModel } from '../../models/databse.model';


@Component({
  selector: 'app-database-detail',
  templateUrl: './database-detail-page.component.html',
  styleUrls: ['./database-detail-page.component.css'],
})
export class DatabaseDetailPageComponent implements OnInit {
  database!: DatabaseModel;
  showTokens: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private parentDatabaseService: ParentDatabaseService,
    private router : Router
  ) {}

  ngOnInit(): void {
    const databaseId = this.route.snapshot.paramMap.get('id')!;
    this.fetchDatabaseDetails(databaseId);
  }

  fetchDatabaseDetails(id: string): void {
    // Replace with your API call to fetch database details
    this.parentDatabaseService.getDatabaseById(id).subscribe(
      (response) => {
        if (response.success) {
          this.database = response.data as DatabaseModel;
        }
      },
      (error) => {
        console.error(
          'An error occurred while fetching database details:',
          error
        );
      }
    );
  }

  toggleTokenVisibility(): void {
    this.showTokens = !this.showTokens;
  }

  openSchemaInfo(): void {
    window.open('/api/schema-info', '_blank');
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(
      () => {
        alert('Token copied to clipboard!');
      },
      (err) => {
        console.error('Failed to copy text: ', err);
      }
    );
  }
  goBack(): void {
    this.router.navigate(['/home']);
  }
}
