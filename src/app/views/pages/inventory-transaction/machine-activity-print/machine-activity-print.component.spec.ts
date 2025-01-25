import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineActivityPrintComponent } from './machine-activity-print.component';

describe('MachineActivityPrintComponent', () => {
  let component: MachineActivityPrintComponent;
  let fixture: ComponentFixture<MachineActivityPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineActivityPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineActivityPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
