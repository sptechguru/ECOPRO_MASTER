import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KycdilogformComponent } from './kycdilogform.component';

describe('KycdilogformComponent', () => {
  let component: KycdilogformComponent;
  let fixture: ComponentFixture<KycdilogformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KycdilogformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KycdilogformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
