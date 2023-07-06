import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BomCostComponent } from './bom-cost.component';

describe('BomCostComponent', () => {
  let component: BomCostComponent;
  let fixture: ComponentFixture<BomCostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BomCostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BomCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
