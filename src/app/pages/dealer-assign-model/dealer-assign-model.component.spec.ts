import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerAssignModelComponent } from './dealer-assign-model.component';

describe('DealerAssignModelComponent', () => {
  let component: DealerAssignModelComponent;
  let fixture: ComponentFixture<DealerAssignModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerAssignModelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealerAssignModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
