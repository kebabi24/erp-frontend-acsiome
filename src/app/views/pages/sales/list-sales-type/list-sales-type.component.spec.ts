import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSalesTypeComponent } from './list-sales-type.component';

describe('ListSalesTypeComponent', () => {
  let component: ListSalesTypeComponent;
  let fixture: ComponentFixture<ListSalesTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSalesTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSalesTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
