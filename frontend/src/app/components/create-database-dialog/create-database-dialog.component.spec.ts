import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDatabaseDialogComponent } from './create-database-dialog.component';

describe('CreateDatabaseDialogComponent', () => {
  let component: CreateDatabaseDialogComponent;
  let fixture: ComponentFixture<CreateDatabaseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDatabaseDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDatabaseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
