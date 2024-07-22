import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueAndOrderingComponent } from './catalogue-and-ordering.component';

describe('CatalogueAndOrderingComponent', () => {
  let component: CatalogueAndOrderingComponent;
  let fixture: ComponentFixture<CatalogueAndOrderingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogueAndOrderingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogueAndOrderingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
