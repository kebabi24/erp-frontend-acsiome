import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalcCmpComponent } from './calc-cmp.component';

describe('CalcCmpComponent', () => {
  let component: CalcCmpComponent;
  let fixture: ComponentFixture<CalcCmpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalcCmpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalcCmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
