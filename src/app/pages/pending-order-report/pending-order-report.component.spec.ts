import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingOrderReportComponent } from './pending-order-report.component';

describe('PendingOrderReportComponent', () => {
  let component: PendingOrderReportComponent;
  let fixture: ComponentFixture<PendingOrderReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingOrderReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingOrderReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
