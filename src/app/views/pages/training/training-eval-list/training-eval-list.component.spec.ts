import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingEvalListComponent } from './training-eval-list.component';

describe('TrainingEvalListComponent', () => {
  let component: TrainingEvalListComponent;
  let fixture: ComponentFixture<TrainingEvalListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingEvalListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingEvalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
