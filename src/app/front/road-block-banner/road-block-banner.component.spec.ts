import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadBlockBannerComponent } from './road-block-banner.component';

describe('RoadBlockBannerComponent', () => {
  let component: RoadBlockBannerComponent;
  let fixture: ComponentFixture<RoadBlockBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoadBlockBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoadBlockBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
