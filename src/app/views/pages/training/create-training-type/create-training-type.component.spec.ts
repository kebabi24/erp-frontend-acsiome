import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTrainingTypeComponent } from './create-training-type.component';

describe('CreateTrainingTypeComponent', () => {
  let component: CreateTrainingTypeComponent;
  let fixture: ComponentFixture<CreateTrainingTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTrainingTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTrainingTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
