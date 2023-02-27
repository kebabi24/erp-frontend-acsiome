import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoReportComponent } from './conso-report.component';

describe('ConsoReportComponent', () => {
  let component: ConsoReportComponent;
  let fixture: ComponentFixture<ConsoReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsoReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsoReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
