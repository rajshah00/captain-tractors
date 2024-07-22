import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceSOPComponent } from './service-sop.component';

describe('ServiceSOPComponent', () => {
  let component: ServiceSOPComponent;
  let fixture: ComponentFixture<ServiceSOPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceSOPComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceSOPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
