import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartsCatalogueComponent } from './parts-catalogue.component';

describe('PartsCatalogueComponent', () => {
  let component: PartsCatalogueComponent;
  let fixture: ComponentFixture<PartsCatalogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartsCatalogueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartsCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
