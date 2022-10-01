import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandingSelectionComponent } from './branding-selection.component';

describe('BrandingSelectionComponent', () => {
  let component: BrandingSelectionComponent;
  let fixture: ComponentFixture<BrandingSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandingSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandingSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
