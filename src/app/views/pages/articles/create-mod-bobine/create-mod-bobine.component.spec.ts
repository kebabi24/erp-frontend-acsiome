import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateModBobineComponent } from './create-mod-bobine.component';

describe('CreateModBobineComponent', () => {
  let component: CreateModBobineComponent;
  let fixture: ComponentFixture<CreateModBobineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateModBobineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateModBobineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
