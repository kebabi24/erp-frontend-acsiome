import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilesMobileComponent } from './profiles-mobile.component';

describe('ProfilesMobileComponent', () => {
  let component: ProfilesMobileComponent;
  let fixture: ComponentFixture<ProfilesMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilesMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilesMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
