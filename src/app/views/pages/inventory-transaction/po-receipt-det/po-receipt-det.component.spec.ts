import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoReceiptDetComponent } from './po-receipt-det.component';

describe('PoReceiptDetComponent', () => {
  let component: PoReceiptDetComponent;
  let fixture: ComponentFixture<PoReceiptDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoReceiptDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoReceiptDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
