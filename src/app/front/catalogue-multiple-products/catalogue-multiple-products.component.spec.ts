import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueMultipleProductsComponent } from './catalogue-multiple-products.component';

describe('CatalogueMultipleProductsComponent', () => {
  let component: CatalogueMultipleProductsComponent;
  let fixture: ComponentFixture<CatalogueMultipleProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogueMultipleProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogueMultipleProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
