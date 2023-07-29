import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEditCostComponent } from './list-edit-cost.component';

describe('ListEditCostComponent', () => {
  let component: ListEditCostComponent;
  let fixture: ComponentFixture<ListEditCostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEditCostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEditCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
