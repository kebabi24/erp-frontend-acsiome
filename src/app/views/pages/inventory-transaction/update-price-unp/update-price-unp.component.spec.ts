import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePriceUnpComponent } from './update-price-unp.component';

describe('UpdatePriceUnpComponent', () => {
  let component: UpdatePriceUnpComponent;
  let fixture: ComponentFixture<UpdatePriceUnpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatePriceUnpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePriceUnpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
