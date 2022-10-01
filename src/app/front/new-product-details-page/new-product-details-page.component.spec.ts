import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProductDetailsPageComponent } from './new-product-details-page.component';

describe('NewProductDetailsPageComponent', () => {
  let component: NewProductDetailsPageComponent;
  let fixture: ComponentFixture<NewProductDetailsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewProductDetailsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewProductDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
