import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFilteredProductComponent } from './search-filtered-product.component';

describe('SearchFilteredProductComponent', () => {
  let component: SearchFilteredProductComponent;
  let fixture: ComponentFixture<SearchFilteredProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchFilteredProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFilteredProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
