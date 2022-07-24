import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCustomerMobileComponent } from './edit-customer-mobile.component';

describe('EditCustomerMobileComponent', () => {
  let component: EditCustomerMobileComponent;
  let fixture: ComponentFixture<EditCustomerMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCustomerMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCustomerMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
