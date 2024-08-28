import { TestBed } from '@angular/core/testing';

import { MockFirebaseService } from './mock-firebase.service';

describe('MockFirebaseService', () => {
  let service: MockFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
