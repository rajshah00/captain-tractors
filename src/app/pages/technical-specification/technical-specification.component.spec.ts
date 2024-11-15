import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalSpecificationComponent } from './technical-specification.component';

describe('TechnicalSpecificationComponent', () => {
  let component: TechnicalSpecificationComponent;
  let fixture: ComponentFixture<TechnicalSpecificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicalSpecificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicalSpecificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
