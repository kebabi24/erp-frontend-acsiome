import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTrainingSessionComponent } from './create-training-session.component';

describe('CreateTrainingSessionComponent', () => {
  let component: CreateTrainingSessionComponent;
  let fixture: ComponentFixture<CreateTrainingSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTrainingSessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTrainingSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
