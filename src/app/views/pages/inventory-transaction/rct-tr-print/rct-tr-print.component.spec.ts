import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RctTrPrintComponent } from './rct-tr-print.component';

describe('RctTrPrintComponent', () => {
  let component: RctTrPrintComponent;
  let fixture: ComponentFixture<RctTrPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RctTrPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RctTrPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
