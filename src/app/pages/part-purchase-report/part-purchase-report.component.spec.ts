import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartPurchaseReportComponent } from './part-purchase-report.component';

describe('PartPurchaseReportComponent', () => {
  let component: PartPurchaseReportComponent;
  let fixture: ComponentFixture<PartPurchaseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartPurchaseReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartPurchaseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
