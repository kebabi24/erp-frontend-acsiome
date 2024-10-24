import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRolePaymentDetailComponent } from './create-role-payment-detail.component';

describe('CreateRolePaymentDetailComponent', () => {
  let component: CreateRolePaymentDetailComponent;
  let fixture: ComponentFixture<CreateRolePaymentDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRolePaymentDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRolePaymentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
