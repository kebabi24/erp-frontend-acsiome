import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProfileMobileComponent } from './create-profile-mobile.component';

describe('CreateProfileMobileComponent', () => {
  let component: CreateProfileMobileComponent;
  let fixture: ComponentFixture<CreateProfileMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateProfileMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProfileMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
