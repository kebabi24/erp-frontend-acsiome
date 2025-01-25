import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPriceQuantityComponent } from './list-price-quantity.component';

describe('ListPriceQuantityComponent', () => {
  let component: ListPriceQuantityComponent;
  let fixture: ComponentFixture<ListPriceQuantityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPriceQuantityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPriceQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
