import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCautionCustComponent } from './create-caution-cust.component';

describe('CreateCautionCustComponent', () => {
  let component: CreateCautionCustComponent;
  let fixture: ComponentFixture<CreateCautionCustComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCautionCustComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCautionCustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
