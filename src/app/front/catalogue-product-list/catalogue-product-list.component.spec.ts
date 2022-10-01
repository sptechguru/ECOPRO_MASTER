import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueProductListComponent } from './catalogue-product-list.component';

describe('CatalogueProductListComponent', () => {
  let component: CatalogueProductListComponent;
  let fixture: ComponentFixture<CatalogueProductListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogueProductListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogueProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
