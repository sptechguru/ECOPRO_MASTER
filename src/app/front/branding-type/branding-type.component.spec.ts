import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandingTypeComponent } from './branding-type.component';

describe('BrandingTypeComponent', () => {
  let component: BrandingTypeComponent;
  let fixture: ComponentFixture<BrandingTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandingTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandingTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
