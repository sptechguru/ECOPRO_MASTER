import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesProductListComponent } from './categories-product-list.component';

describe('CategoriesProductListComponent', () => {
  let component: CategoriesProductListComponent;
  let fixture: ComponentFixture<CategoriesProductListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriesProductListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
