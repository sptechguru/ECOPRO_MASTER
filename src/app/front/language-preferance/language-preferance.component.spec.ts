import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguagePreferanceComponent } from './language-preferance.component';

describe('LanguagePreferanceComponent', () => {
  let component: LanguagePreferanceComponent;
  let fixture: ComponentFixture<LanguagePreferanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LanguagePreferanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguagePreferanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
