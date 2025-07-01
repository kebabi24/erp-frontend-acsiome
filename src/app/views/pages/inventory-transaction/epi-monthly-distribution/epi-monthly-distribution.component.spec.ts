import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpiMonthlyDistributionComponent } from './epi-monthly-distribution.component';

describe('EpiMonthlyDistributionComponent', () => {
  let component: EpiMonthlyDistributionComponent;
  let fixture: ComponentFixture<EpiMonthlyDistributionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpiMonthlyDistributionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpiMonthlyDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
