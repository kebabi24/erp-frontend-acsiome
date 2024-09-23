import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReqTrainingComponent } from './create-req-training.component';

describe('CreateReqTrainingComponent', () => {
  let component: CreateReqTrainingComponent;
  let fixture: ComponentFixture<CreateReqTrainingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateReqTrainingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateReqTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
