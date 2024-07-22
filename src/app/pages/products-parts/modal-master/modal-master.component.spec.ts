import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMasterComponent } from './modal-master.component';

describe('ModalMasterComponent', () => {
  let component: ModalMasterComponent;
  let fixture: ComponentFixture<ModalMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
