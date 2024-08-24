import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartsOrderComponent } from './parts-order.component';

describe('PartsOrderComponent', () => {
  let component: PartsOrderComponent;
  let fixture: ComponentFixture<PartsOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartsOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartsOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
