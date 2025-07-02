import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpiCycleemployeListComponent } from './epi-cycleemploye-list.component';

describe('EpiCycleemployeListComponent', () => {
  let component: EpiCycleemployeListComponent;
  let fixture: ComponentFixture<EpiCycleemployeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpiCycleemployeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpiCycleemployeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
