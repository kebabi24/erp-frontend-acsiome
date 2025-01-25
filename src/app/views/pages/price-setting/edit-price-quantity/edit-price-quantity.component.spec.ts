import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPriceQuantityComponent } from './edit-price-quantity.component';

describe('EditPriceQuantityComponent', () => {
  let component: EditPriceQuantityComponent;
  let fixture: ComponentFixture<EditPriceQuantityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPriceQuantityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPriceQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
