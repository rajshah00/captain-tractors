import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ICircularComponent } from './i-circular.component';

describe('ICircularComponent', () => {
  let component: ICircularComponent;
  let fixture: ComponentFixture<ICircularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ICircularComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ICircularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
