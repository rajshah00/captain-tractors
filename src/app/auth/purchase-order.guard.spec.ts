import { TestBed } from '@angular/core/testing';

import { PurchaseOrderGuard } from './purchase-order.guard';

describe('PurchaseOrderGuard', () => {
  let guard: PurchaseOrderGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PurchaseOrderGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
