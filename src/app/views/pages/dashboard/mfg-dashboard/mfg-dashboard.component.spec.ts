import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MfgDashboardComponent } from './mfg-dashboard.component';

describe('MfgDashboardComponent', () => {
  let component: MfgDashboardComponent;
  let fixture: ComponentFixture<MfgDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MfgDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MfgDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
