import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RctPoPrintComponent } from './rct-po-print.component';

describe('RctPoPrintComponent', () => {
  let component: RctPoPrintComponent;
  let fixture: ComponentFixture<RctPoPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RctPoPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RctPoPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
