import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCustomerMobileComponent } from './create-customer-mobile.component';

describe('CreateCustomerMobileComponent', () => {
  let component: CreateCustomerMobileComponent;
  let fixture: ComponentFixture<CreateCustomerMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCustomerMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCustomerMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
