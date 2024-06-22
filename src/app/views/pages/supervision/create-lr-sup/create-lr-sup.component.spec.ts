import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLrSupComponent } from './create-lr-sup.component';

describe('CreateLrSupComponent', () => {
  let component: CreateLrSupComponent;
  let fixture: ComponentFixture<CreateLrSupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLrSupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLrSupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
