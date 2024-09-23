import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTrainingCalanderComponent } from './create-training-calander.component';

describe('CreateTrainingCalanderComponent', () => {
  let component: CreateTrainingCalanderComponent;
  let fixture: ComponentFixture<CreateTrainingCalanderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTrainingCalanderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTrainingCalanderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
