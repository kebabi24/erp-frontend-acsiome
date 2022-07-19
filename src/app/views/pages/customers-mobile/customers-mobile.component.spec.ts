import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersMobileComponent } from './customers-mobile.component';

describe('CustomersMobileComponent', () => {
  let component: CustomersMobileComponent;
  let fixture: ComponentFixture<CustomersMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomersMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
