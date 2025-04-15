import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateChargePayableDetailComponent } from './create-charge-payable-detail.component';

describe('CreateChargePayableDetailComponent', () => {
  let component: CreateChargePayableDetailComponent;
  let fixture: ComponentFixture<CreateChargePayableDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateChargePayableDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateChargePayableDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
