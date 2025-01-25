import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingHotEvalComponent } from './training-hot-eval.component';

describe('TrainingHotEvalComponent', () => {
  let component: TrainingHotEvalComponent;
  let fixture: ComponentFixture<TrainingHotEvalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingHotEvalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingHotEvalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
