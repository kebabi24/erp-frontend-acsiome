import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRepJobComponent } from './create-rep-job.component';

describe('CreateRepJobComponent', () => {
  let component: CreateRepJobComponent;
  let fixture: ComponentFixture<CreateRepJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRepJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRepJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
