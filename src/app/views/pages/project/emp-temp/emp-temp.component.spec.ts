import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpTempComponent } from './emp-temp.component';

describe('EmpTempComponent', () => {
  let component: EmpTempComponent;
  let fixture: ComponentFixture<EmpTempComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpTempComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpTempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
