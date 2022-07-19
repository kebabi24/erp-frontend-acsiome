import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCustomerMobileComponent } from './list-customer-mobile.component';

describe('ListCustomerMobileComponent', () => {
  let component: ListCustomerMobileComponent;
  let fixture: ComponentFixture<ListCustomerMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCustomerMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCustomerMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
