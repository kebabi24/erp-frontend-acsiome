import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListVisiteRoleComponent } from './list-visite-role.component';

describe('ListVisiteRoleComponent', () => {
  let component: ListVisiteRoleComponent;
  let fixture: ComponentFixture<ListVisiteRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListVisiteRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListVisiteRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
