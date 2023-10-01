import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewCustomerReqComponent } from './review-customer-req.component';

describe('ReviewCustomerReqComponent', () => {
  let component: ReviewCustomerReqComponent;
  let fixture: ComponentFixture<ReviewCustomerReqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewCustomerReqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewCustomerReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
