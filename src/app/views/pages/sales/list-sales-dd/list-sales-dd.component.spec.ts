import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSalesDdComponent } from './list-sales-dd.component';

describe('ListSalesDdComponent', () => {
  let component: ListSalesDdComponent;
  let fixture: ComponentFixture<ListSalesDdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSalesDdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSalesDdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
