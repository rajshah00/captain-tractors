import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnersManualsComponent } from './owners-manuals.component';

describe('OwnersManualsComponent', () => {
  let component: OwnersManualsComponent;
  let fixture: ComponentFixture<OwnersManualsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnersManualsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnersManualsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
