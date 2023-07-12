import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostpriceListComponent } from './costprice-list.component';

describe('CostpriceListComponent', () => {
  let component: CostpriceListComponent;
  let fixture: ComponentFixture<CostpriceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostpriceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostpriceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
