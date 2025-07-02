import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInvoicesDetailComponent } from './list-invoices-detail.component';

describe('ListInvoicesDetailComponent', () => {
  let component: ListInvoicesDetailComponent;
  let fixture: ComponentFixture<ListInvoicesDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListInvoicesDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInvoicesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
