import { TestBed } from '@angular/core/testing';

import { ParentDatabaseService } from './parent-database.service';

describe('DatabaseCreationService', () => {
  let service: ParentDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParentDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
