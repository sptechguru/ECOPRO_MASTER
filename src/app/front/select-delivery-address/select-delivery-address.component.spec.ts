import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDeliveryAddressComponent } from './select-delivery-address.component';

describe('SelectDeliveryAddressComponent', () => {
  let component: SelectDeliveryAddressComponent;
  let fixture: ComponentFixture<SelectDeliveryAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectDeliveryAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDeliveryAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
