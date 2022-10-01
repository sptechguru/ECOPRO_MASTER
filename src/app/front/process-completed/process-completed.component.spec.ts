import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessCompletedComponent } from './process-completed.component';

describe('ProcessCompletedComponent', () => {
  let component: ProcessCompletedComponent;
  let fixture: ComponentFixture<ProcessCompletedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessCompletedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
