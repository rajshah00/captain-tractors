import { TestBed } from '@angular/core/testing';

import { PendingFormGuard } from './pending-form.guard';

describe('PendingFormGuard', () => {
  let guard: PendingFormGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PendingFormGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
