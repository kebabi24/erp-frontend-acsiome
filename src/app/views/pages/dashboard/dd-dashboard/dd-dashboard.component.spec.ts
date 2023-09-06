import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DdDashboardComponent } from './dd-dashboard.component';

describe('DdDashboardComponent', () => {
  let component: DdDashboardComponent;
  let fixture: ComponentFixture<DdDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DdDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
