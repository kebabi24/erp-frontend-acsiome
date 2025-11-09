import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UndoInvoiceComponent } from './undo-invoice.component';

describe('UndoInvoiceComponent', () => {
  let component: UndoInvoiceComponent;
  let fixture: ComponentFixture<UndoInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UndoInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UndoInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
