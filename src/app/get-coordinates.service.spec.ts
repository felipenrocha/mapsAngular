import { TestBed } from '@angular/core/testing';

import { GetCoordinatesService } from './get-coordinates.service';

describe('GetCoordinatesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetCoordinatesService = TestBed.get(GetCoordinatesService);
    expect(service).toBeTruthy();
  });
});
