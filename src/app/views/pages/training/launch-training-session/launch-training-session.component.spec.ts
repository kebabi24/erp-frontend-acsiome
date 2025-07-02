import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchTrainingSessionComponent } from './launch-training-session.component';

describe('LaunchTrainingSessionComponent', () => {
  let component: LaunchTrainingSessionComponent;
  let fixture: ComponentFixture<LaunchTrainingSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaunchTrainingSessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaunchTrainingSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
