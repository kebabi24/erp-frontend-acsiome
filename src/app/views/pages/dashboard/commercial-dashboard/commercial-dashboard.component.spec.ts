import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercialDashboardComponent } from './commercial-dashboard.component';

describe('CommercialDashboardComponent', () => {
  let component: CommercialDashboardComponent;
  let fixture: ComponentFixture<CommercialDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommercialDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommercialDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
