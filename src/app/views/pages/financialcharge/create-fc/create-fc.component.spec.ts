import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFcComponent } from './create-fc.component';

describe('CreateFcComponent', () => {
  let component: CreateFcComponent;
  let fixture: ComponentFixture<CreateFcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
