import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPaymentRoleComponent } from './list-payment-role.component';

describe('ListPaymentRoleComponent', () => {
  let component: ListPaymentRoleComponent;
  let fixture: ComponentFixture<ListPaymentRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPaymentRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPaymentRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
