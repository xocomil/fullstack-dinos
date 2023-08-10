import { TestBed } from '@angular/core/testing';

import { DinosCrudService } from './dinos-crud.service';

describe('DinosCrudService', () => {
  let service: DinosCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DinosCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
