import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBrandingComponent } from './product-branding.component';

describe('ProductBrandingComponent', () => {
  let component: ProductBrandingComponent;
  let fixture: ComponentFixture<ProductBrandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductBrandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBrandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
