import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseDetailPageComponent } from './database-detail-page.component';

describe('DatabaseDetailPageComponent', () => {
  let component: DatabaseDetailPageComponent;
  let fixture: ComponentFixture<DatabaseDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatabaseDetailPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatabaseDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
