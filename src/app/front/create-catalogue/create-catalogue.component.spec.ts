import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCatalogueComponent } from './create-catalogue.component';

describe('CreateCatalogueComponent', () => {
  let component: CreateCatalogueComponent;
  let fixture: ComponentFixture<CreateCatalogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCatalogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
