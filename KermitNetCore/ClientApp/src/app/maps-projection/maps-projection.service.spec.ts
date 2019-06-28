import { TestBed } from '@angular/core/testing';

import { MapsProjectionService } from './maps-projection.service';

describe('MapsProjectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapsProjectionService = TestBed.get(MapsProjectionService);
    expect(service).toBeTruthy();
  });
});
