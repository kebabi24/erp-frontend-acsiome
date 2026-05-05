import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSalesInvComponent } from './list-sales-inv.component';

describe('ListSalesInvComponent', () => {
  let component: ListSalesInvComponent;
  let fixture: ComponentFixture<ListSalesInvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSalesInvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSalesInvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
