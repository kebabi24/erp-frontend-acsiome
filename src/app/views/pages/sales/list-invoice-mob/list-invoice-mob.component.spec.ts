import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInvoiceMobComponent } from './list-invoice-mob.component';

describe('ListInvoiceMobComponent', () => {
  let component: ListInvoiceMobComponent;
  let fixture: ComponentFixture<ListInvoiceMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListInvoiceMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInvoiceMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
