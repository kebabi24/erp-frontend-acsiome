import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCustomerImmobilierComponent } from './create-customer-immobilier.component';

describe('CreateCustomerImmobilierComponent', () => {
  let component: CreateCustomerImmobilierComponent;
  let fixture: ComponentFixture<CreateCustomerImmobilierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCustomerImmobilierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCustomerImmobilierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
