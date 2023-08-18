import { TestBed } from '@angular/core/testing';

import { DetailsStoreService } from './details-store.service';

describe('DetailsStoreService', () => {
  let service: DetailsStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailsStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
