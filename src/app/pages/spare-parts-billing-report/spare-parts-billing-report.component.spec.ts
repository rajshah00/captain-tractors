import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SparePartsBillingReportComponent } from './spare-parts-billing-report.component';

describe('SparePartsBillingReportComponent', () => {
  let component: SparePartsBillingReportComponent;
  let fixture: ComponentFixture<SparePartsBillingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SparePartsBillingReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SparePartsBillingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
