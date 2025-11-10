import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExWoPrintComponent } from './ex-wo-print.component';

describe('ExWoPrintComponent', () => {
  let component: ExWoPrintComponent;
  let fixture: ComponentFixture<ExWoPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExWoPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExWoPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
