import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersSoldeComponent } from './customers-solde.component';

describe('CustomersSoldeComponent', () => {
  let component: CustomersSoldeComponent;
  let fixture: ComponentFixture<CustomersSoldeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomersSoldeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersSoldeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
