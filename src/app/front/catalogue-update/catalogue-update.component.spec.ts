import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueUpdateComponent } from './catalogue-update.component';

describe('CatalogueUpdateComponent', () => {
  let component: CatalogueUpdateComponent;
  let fixture: ComponentFixture<CatalogueUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogueUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogueUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
