import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoCostComponent } from './ro-cost.component';

describe('RoCostComponent', () => {
  let component: RoCostComponent;
  let fixture: ComponentFixture<RoCostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoCostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
