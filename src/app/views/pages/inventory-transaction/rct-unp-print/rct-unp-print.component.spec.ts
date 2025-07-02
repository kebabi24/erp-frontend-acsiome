import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RctUnpPrintComponent } from './rct-unp-print.component';

describe('RctUnpPrintComponent', () => {
  let component: RctUnpPrintComponent;
  let fixture: ComponentFixture<RctUnpPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RctUnpPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RctUnpPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
