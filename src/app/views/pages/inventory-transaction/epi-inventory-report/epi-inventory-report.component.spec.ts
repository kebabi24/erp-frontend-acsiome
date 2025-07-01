import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpiInventoryReportComponent } from './epi-inventory-report.component';

describe('EpiInventoryReportComponent', () => {
  let component: EpiInventoryReportComponent;
  let fixture: ComponentFixture<EpiInventoryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpiInventoryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpiInventoryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
