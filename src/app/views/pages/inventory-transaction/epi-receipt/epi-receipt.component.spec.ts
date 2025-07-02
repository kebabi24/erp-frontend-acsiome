import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpiReceiptComponent } from './epi-receipt.component';

describe('EpiReceiptComponent', () => {
  let component: EpiReceiptComponent;
  let fixture: ComponentFixture<EpiReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpiReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpiReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
