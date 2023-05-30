import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetPrinterComponent } from './set-printer.component';

describe('SetPrinterComponent', () => {
  let component: SetPrinterComponent;
  let fixture: ComponentFixture<SetPrinterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetPrinterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetPrinterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
