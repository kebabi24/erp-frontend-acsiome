import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueTransferComponent } from './revenue-transfer.component';

describe('RevenueTransferComponent', () => {
  let component: RevenueTransferComponent;
  let fixture: ComponentFixture<RevenueTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevenueTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenueTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
