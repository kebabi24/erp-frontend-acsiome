import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelAllocationComponent } from './label-allocation.component';

describe('LabelAllocationComponent', () => {
  let component: LabelAllocationComponent;
  let fixture: ComponentFixture<LabelAllocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelAllocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
