import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInvoiceRoleComponent } from './list-invoice-role.component';

describe('ListInvoiceRoleComponent', () => {
  let component: ListInvoiceRoleComponent;
  let fixture: ComponentFixture<ListInvoiceRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListInvoiceRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInvoiceRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
