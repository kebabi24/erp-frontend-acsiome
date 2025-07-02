import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpiInventoryTransactionComponent } from './epi-inventory-transaction.component';

describe('EpiInventoryTransactionComponent', () => {
  let component: EpiInventoryTransactionComponent;
  let fixture: ComponentFixture<EpiInventoryTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpiInventoryTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpiInventoryTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
