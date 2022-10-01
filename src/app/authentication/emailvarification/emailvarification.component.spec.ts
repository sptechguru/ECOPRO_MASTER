import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailvarificationComponent } from './emailvarification.component';

describe('EmailvarificationComponent', () => {
  let component: EmailvarificationComponent;
  let fixture: ComponentFixture<EmailvarificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailvarificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailvarificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
