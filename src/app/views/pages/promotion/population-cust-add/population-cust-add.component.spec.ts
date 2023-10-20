import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopulationCustomerAddComponent } from './population-cust-add.component';

describe('CreateCustomerMobileComponent', () => {
  let component: PopulationCustomerAddComponent;
  let fixture: ComponentFixture<PopulationCustomerAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopulationCustomerAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopulationCustomerAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
