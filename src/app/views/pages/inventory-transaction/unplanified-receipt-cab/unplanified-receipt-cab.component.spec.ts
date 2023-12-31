import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnplanifiedReceiptCabComponent } from './unplanified-receipt-cab.component';

describe('UnplanifiedReceiptCabComponent', () => {
  let component: UnplanifiedReceiptCabComponent;
  let fixture: ComponentFixture<UnplanifiedReceiptCabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnplanifiedReceiptCabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnplanifiedReceiptCabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
