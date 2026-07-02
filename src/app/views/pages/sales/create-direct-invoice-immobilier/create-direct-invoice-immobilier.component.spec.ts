import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDirectInvoiceImmobilierComponent } from './create-direct-invoice-immobilier.component';

describe('CreateDirectInvoiceImmobilierComponent', () => {
  let component: CreateDirectInvoiceImmobilierComponent;
  let fixture: ComponentFixture<CreateDirectInvoiceImmobilierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDirectInvoiceImmobilierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDirectInvoiceImmobilierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
