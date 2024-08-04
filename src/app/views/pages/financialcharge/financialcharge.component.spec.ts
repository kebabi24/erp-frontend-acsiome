import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialchargeComponent } from './financialcharge.component';

describe('FinancialchargeComponent', () => {
  let component: FinancialchargeComponent;
  let fixture: ComponentFixture<FinancialchargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialchargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialchargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
