import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfileServiceComponent } from './edit-profile-service.component';

describe('EditProfileServiceComponent', () => {
  let component: EditProfileServiceComponent;
  let fixture: ComponentFixture<EditProfileServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProfileServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProfileServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
