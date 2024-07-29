import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ICatalogueComponent } from './i-catalogue.component';

describe('ICatalogueComponent', () => {
  let component: ICatalogueComponent;
  let fixture: ComponentFixture<ICatalogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ICatalogueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ICatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
