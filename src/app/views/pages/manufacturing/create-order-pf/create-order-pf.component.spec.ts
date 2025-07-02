import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrderPfComponent } from './create-order-pf.component';

describe('CreateOrderPfComponent', () => {
  let component: CreateOrderPfComponent;
  let fixture: ComponentFixture<CreateOrderPfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateOrderPfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrderPfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
