import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateLrSupComponent } from './validate-lr-sup.component';

describe('ValidateLrSupComponent', () => {
  let component: ValidateLrSupComponent;
  let fixture: ComponentFixture<ValidateLrSupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidateLrSupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateLrSupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
