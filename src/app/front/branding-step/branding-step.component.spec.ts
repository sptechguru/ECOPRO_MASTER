import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandingStepComponent } from './branding-step.component';

describe('BrandingStepComponent', () => {
  let component: BrandingStepComponent;
  let fixture: ComponentFixture<BrandingStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandingStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandingStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
