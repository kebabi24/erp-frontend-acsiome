import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSatisfactionComponent } from './create-satisfaction.component';

describe('CreateSatisfactionComponent', () => {
  let component: CreateSatisfactionComponent;
  let fixture: ComponentFixture<CreateSatisfactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSatisfactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSatisfactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
