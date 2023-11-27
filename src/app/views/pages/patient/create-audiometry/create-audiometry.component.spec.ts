import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAudiometryComponent } from './create-audiometry.component';

describe('CreateAudiometryComponent', () => {
  let component: CreateAudiometryComponent;
  let fixture: ComponentFixture<CreateAudiometryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAudiometryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAudiometryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
