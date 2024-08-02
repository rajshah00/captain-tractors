import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalOrderReportComponent } from './approval-order-report.component';

describe('ApprovalOrderReportComponent', () => {
  let component: ApprovalOrderReportComponent;
  let fixture: ComponentFixture<ApprovalOrderReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalOrderReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalOrderReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
