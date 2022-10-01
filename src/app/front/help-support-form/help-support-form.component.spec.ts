import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpSupportFormComponent } from './help-support-form.component';

describe('HelpSupportFormComponent', () => {
  let component: HelpSupportFormComponent;
  let fixture: ComponentFixture<HelpSupportFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpSupportFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpSupportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
