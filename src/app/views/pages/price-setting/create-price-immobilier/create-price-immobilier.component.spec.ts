import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePriceImmobilierComponent } from './create-price-immobilier.component';

describe('CreatePriceImmobilierComponent', () => {
  let component: CreatePriceImmobilierComponent;
  let fixture: ComponentFixture<CreatePriceImmobilierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePriceImmobilierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePriceImmobilierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
