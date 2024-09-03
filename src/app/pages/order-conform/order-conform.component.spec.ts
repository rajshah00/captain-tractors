import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderConformComponent } from './order-conform.component';

describe('OrderConformComponent', () => {
  let component: OrderConformComponent;
  let fixture: ComponentFixture<OrderConformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderConformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderConformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
