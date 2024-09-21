import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamelReportsComponent } from './camel-reports.component';

describe('CamelReportsComponent', () => {
  let component: CamelReportsComponent;
  let fixture: ComponentFixture<CamelReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CamelReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CamelReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
