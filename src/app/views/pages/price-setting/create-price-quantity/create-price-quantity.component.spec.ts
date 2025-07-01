import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePriceQuantityComponent } from './create-price-quantity.component';

describe('CreatePriceQuantityComponent', () => {
  let component: CreatePriceQuantityComponent;
  let fixture: ComponentFixture<CreatePriceQuantityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePriceQuantityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePriceQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
