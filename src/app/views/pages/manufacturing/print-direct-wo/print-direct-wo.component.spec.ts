import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintDirectWoComponent } from './print-direct-wo.component';

describe('PrintDirectWoComponent', () => {
  let component: PrintDirectWoComponent;
  let fixture: ComponentFixture<PrintDirectWoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintDirectWoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintDirectWoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
