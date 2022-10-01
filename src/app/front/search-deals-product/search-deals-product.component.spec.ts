import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDealsProductComponent } from './search-deals-product.component';

describe('SearchDealsProductComponent', () => {
  let component: SearchDealsProductComponent;
  let fixture: ComponentFixture<SearchDealsProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchDealsProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchDealsProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
