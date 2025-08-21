import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProformaComponent } from './list-proforma.component';

describe('ListProformaComponent', () => {
  let component: ListProformaComponent;
  let fixture: ComponentFixture<ListProformaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListProformaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListProformaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
