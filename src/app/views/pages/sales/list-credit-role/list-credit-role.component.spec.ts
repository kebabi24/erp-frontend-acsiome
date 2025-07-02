import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCreditRoleComponent } from './list-credit-role.component';

describe('ListCreditRoleComponent', () => {
  let component: ListCreditRoleComponent;
  let fixture: ComponentFixture<ListCreditRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCreditRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCreditRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
