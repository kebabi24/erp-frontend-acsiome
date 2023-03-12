import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateChargeDemandeComponent } from './validate-charge-demande.component';

describe('CreateNewServiceComponent', () => {
  let component: ValidateChargeDemandeComponent;
  let fixture: ComponentFixture<ValidateChargeDemandeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidateChargeDemandeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateChargeDemandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
