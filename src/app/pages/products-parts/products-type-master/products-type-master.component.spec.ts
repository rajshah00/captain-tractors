import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsTypeMasterComponent } from './products-type-master.component';

describe('ProductsTypeMasterComponent', () => {
  let component: ProductsTypeMasterComponent;
  let fixture: ComponentFixture<ProductsTypeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsTypeMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
