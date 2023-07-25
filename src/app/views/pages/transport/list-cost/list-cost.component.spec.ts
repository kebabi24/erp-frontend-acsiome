import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCostComponent } from './list-cost.component';

describe('ListCostComponent', () => {
  let component: ListCostComponent;
  let fixture: ComponentFixture<ListCostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
