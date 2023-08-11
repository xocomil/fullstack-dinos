import { TestBed } from '@angular/core/testing';

import { DinosCrudStoreService } from './dinos-crud.store.service';

describe('DinosCrudStoreService', () => {
  let service: DinosCrudStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DinosCrudStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
