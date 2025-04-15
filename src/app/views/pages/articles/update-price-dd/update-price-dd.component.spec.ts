import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePriceDdComponent } from './update-price-dd.component';

describe('UpdatePriceDdComponent', () => {
  let component: UpdatePriceDdComponent;
  let fixture: ComponentFixture<UpdatePriceDdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatePriceDdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePriceDdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
