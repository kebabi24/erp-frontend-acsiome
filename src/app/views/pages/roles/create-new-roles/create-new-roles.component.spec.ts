import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewRolesComponent } from './create-new-roles.component';

describe('CreateNewRolesComponent', () => {
  let component: CreateNewRolesComponent;
  let fixture: ComponentFixture<CreateNewRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
