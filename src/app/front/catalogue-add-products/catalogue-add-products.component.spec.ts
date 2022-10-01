import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueAddProductsComponent } from './catalogue-add-products.component';

describe('CatalogueAddProductsComponent', () => {
  let component: CatalogueAddProductsComponent;
  let fixture: ComponentFixture<CatalogueAddProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogueAddProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogueAddProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
