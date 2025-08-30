import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProformaComponent } from './edit-proforma.component';

describe('EditProformaComponent', () => {
  let component: EditProformaComponent;
  let fixture: ComponentFixture<EditProformaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProformaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProformaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
