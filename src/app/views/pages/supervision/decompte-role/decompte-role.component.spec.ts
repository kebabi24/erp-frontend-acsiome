import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DecompteRoleComponent } from './decompte-role.component';

describe('DecompteRoleComponent', () => {
  let component: DecompteRoleComponent;
  let fixture: ComponentFixture<DecompteRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DecompteRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecompteRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
