import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCautionCustComponent } from './list-caution-cust.component';

describe('ListCautionCustComponent', () => {
  let component: ListCautionCustComponent;
  let fixture: ComponentFixture<ListCautionCustComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCautionCustComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCautionCustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
