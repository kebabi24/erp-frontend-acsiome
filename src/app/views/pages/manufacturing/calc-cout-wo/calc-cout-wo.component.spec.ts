import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalcCoutWoComponent } from './calc-cout-wo.component';

describe('CalcCoutWoComponent', () => {
  let component: CalcCoutWoComponent;
  let fixture: ComponentFixture<CalcCoutWoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalcCoutWoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalcCoutWoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
