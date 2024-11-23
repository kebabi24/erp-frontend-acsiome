import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSalesRoleComponent } from './list-sales-role.component';

describe('ListSalesRoleComponent', () => {
  let component: ListSalesRoleComponent;
  let fixture: ComponentFixture<ListSalesRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSalesRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSalesRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
