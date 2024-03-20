import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStdCustomerComponent } from './create-std-customer.component';

describe('CreateStdCustomerComponent', () => {
  let component: CreateStdCustomerComponent;
  let fixture: ComponentFixture<CreateStdCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateStdCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStdCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
