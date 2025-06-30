import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInvoiceAccComponent } from './list-invoice-acc.component';

describe('ListInvoiceAccComponent', () => {
  let component: ListInvoiceAccComponent;
  let fixture: ComponentFixture<ListInvoiceAccComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListInvoiceAccComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInvoiceAccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
