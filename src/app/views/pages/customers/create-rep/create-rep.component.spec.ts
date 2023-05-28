import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRepComponent } from './create-rep.component';

describe('CreateRepComponent', () => {
  let component: CreateRepComponent;
  let fixture: ComponentFixture<CreateRepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
