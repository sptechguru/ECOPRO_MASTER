import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserveStockComponent } from './reserve-stock.component';

describe('ReserveStockComponent', () => {
  let component: ReserveStockComponent;
  let fixture: ComponentFixture<ReserveStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReserveStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReserveStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
