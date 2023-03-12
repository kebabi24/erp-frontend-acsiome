import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileProductsPagesAssignComponent } from './profile-ppages-assign.component';

describe('ProfileProductsPagesAssignComponent', () => {
  let component: ProfileProductsPagesAssignComponent;
  let fixture: ComponentFixture<ProfileProductsPagesAssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileProductsPagesAssignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileProductsPagesAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
