import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInventoryRoleComponent } from './list-inventory-role.component';

describe('ListInventoryRoleComponent', () => {
  let component: ListInventoryRoleComponent;
  let fixture: ComponentFixture<ListInventoryRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListInventoryRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInventoryRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
