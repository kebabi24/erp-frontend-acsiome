import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStrandardSpecificationComponent } from './create-standard-specification.component';

describe('CreateStrandardSpecificationComponent', () => {
  let component: CreateStrandardSpecificationComponent;
  let fixture: ComponentFixture<CreateStrandardSpecificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateStrandardSpecificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStrandardSpecificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
