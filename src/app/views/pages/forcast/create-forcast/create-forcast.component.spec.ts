import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateForcastComponent } from './create-forcast.component';

describe('CreateForcastComponent', () => {
  let component: CreateForcastComponent;
  let fixture: ComponentFixture<CreateForcastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateForcastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateForcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
