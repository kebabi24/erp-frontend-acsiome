import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingColdEvalComponent } from './training-cold-eval.component';

describe('TrainingColdEvalComponent', () => {
  let component: TrainingColdEvalComponent;
  let fixture: ComponentFixture<TrainingColdEvalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingColdEvalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingColdEvalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
