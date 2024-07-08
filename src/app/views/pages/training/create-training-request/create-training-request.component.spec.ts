import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTrainingRequestComponent } from './create-training-request.component';

describe('CreateTrainingRequestComponent', () => {
  let component: CreateTrainingRequestComponent;
  let fixture: ComponentFixture<CreateTrainingRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTrainingRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTrainingRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
