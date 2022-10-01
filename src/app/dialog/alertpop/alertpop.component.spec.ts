import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertpopComponent } from './alertpop.component';

describe('AlertpopComponent', () => {
  let component: AlertpopComponent;
  let fixture: ComponentFixture<AlertpopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertpopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertpopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
