import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProjectPaymentComponent } from './create-project-payment.component';

describe('CreateProjectPaymentComponent', () => {
  let component: CreateProjectPaymentComponent;
  let fixture: ComponentFixture<CreateProjectPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateProjectPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProjectPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
