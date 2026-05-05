import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInvoiceIhComponent } from './create-invoice-ih.component';

describe('CreateInvoiceIhComponent', () => {
  let component: CreateInvoiceIhComponent;
  let fixture: ComponentFixture<CreateInvoiceIhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateInvoiceIhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInvoiceIhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
