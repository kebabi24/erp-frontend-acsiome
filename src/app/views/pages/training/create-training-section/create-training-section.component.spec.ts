import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTrainingSectionComponent } from './create-training-section.component';

describe('CreateTrainingSectionComponent', () => {
  let component: CreateTrainingSectionComponent;
  let fixture: ComponentFixture<CreateTrainingSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTrainingSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTrainingSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
