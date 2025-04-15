import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRolesSalesComponent } from './list-roles-sales.component';

describe('ListRolesSalesComponent', () => {
  let component: ListRolesSalesComponent;
  let fixture: ComponentFixture<ListRolesSalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListRolesSalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRolesSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
