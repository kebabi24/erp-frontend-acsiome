import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessMonitoringSheetComponent } from './business-monitoring-sheet.component';

describe('BusinessMonitoringSheetComponent', () => {
  let component: BusinessMonitoringSheetComponent;
  let fixture: ComponentFixture<BusinessMonitoringSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessMonitoringSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessMonitoringSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
