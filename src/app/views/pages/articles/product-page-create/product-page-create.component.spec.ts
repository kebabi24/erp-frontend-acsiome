import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPageCreateComponent } from './product-page-create.component';

describe('ProductPageCreateComponent', () => {
  let component: ProductPageCreateComponent;
  let fixture: ComponentFixture<ProductPageCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductPageCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPageCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
