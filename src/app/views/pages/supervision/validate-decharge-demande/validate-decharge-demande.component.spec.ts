import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateDeChargeDemandeComponent } from './validate-decharge-demande.component';

describe('CreateNewServiceComponent', () => {
  let component: ValidateDeChargeDemandeComponent;
  let fixture: ComponentFixture<ValidateDeChargeDemandeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidateDeChargeDemandeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateDeChargeDemandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
