import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeSalaryComponent } from './employe-salary.component';

describe('EmployeSalaryComponent', () => {
  let component: EmployeSalaryComponent;
  let fixture: ComponentFixture<EmployeSalaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeSalaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
