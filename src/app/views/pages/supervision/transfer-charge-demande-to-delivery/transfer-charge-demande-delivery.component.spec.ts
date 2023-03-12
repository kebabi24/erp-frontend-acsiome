import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferChargeDemandeToDeliveryComponent } from './transfer-charge-demande-delivery.component';

describe('CreateNewServiceComponent', () => {
  let component: TransferChargeDemandeToDeliveryComponent;
  let fixture: ComponentFixture<TransferChargeDemandeToDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferChargeDemandeToDeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferChargeDemandeToDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
