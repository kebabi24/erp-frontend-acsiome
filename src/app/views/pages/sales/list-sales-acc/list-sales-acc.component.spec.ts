import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSalesAccComponent } from './list-sales-acc.component';

describe('ListSalesAccComponent', () => {
  let component: ListSalesAccComponent;
  let fixture: ComponentFixture<ListSalesAccComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSalesAccComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSalesAccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
