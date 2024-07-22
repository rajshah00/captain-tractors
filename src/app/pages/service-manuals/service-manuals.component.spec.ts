import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceManualsComponent } from './service-manuals.component';

describe('ServiceManualsComponent', () => {
  let component: ServiceManualsComponent;
  let fixture: ComponentFixture<ServiceManualsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceManualsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceManualsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
