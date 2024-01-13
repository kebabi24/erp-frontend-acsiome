import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTransfertPaymentComponent } from './list-transfert-payment.component';

describe('ListTransfertPaymentComponent', () => {
  let component: ListTransfertPaymentComponent;
  let fixture: ComponentFixture<ListTransfertPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTransfertPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTransfertPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
