import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllRolesComponent } from './list-all-roles.component';

describe('ListAllRolesComponent', () => {
  let component: ListAllRolesComponent;
  let fixture: ComponentFixture<ListAllRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAllRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAllRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
