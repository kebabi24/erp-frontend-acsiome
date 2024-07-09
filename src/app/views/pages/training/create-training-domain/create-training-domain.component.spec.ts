import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTrainingDomainComponent } from './create-training-domain.component';

describe('CreateTrainingDomainComponent', () => {
  let component: CreateTrainingDomainComponent;
  let fixture: ComponentFixture<CreateTrainingDomainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTrainingDomainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTrainingDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
