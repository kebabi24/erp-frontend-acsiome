import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilesMobileListComponent } from './profiles-list-mobile.component';

describe('ProfilesMobileListComponent', () => {
  let component: ProfilesMobileListComponent;
  let fixture: ComponentFixture<ProfilesMobileListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilesMobileListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilesMobileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
