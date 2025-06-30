import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCreditDdComponent } from './list-credit-dd.component';

describe('ListCreditDdComponent', () => {
  let component: ListCreditDdComponent;
  let fixture: ComponentFixture<ListCreditDdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCreditDdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCreditDdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
