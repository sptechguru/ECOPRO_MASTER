import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductVariantDetailComponent } from './product-variant-detail.component';

describe('ProductVariantDetailComponent', () => {
  let component: ProductVariantDetailComponent;
  let fixture: ComponentFixture<ProductVariantDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductVariantDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductVariantDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
