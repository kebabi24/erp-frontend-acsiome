import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUserMobileComponent } from './create-user-mobile.component';

describe('CreateUserMobileComponent', () => {
  let component: CreateUserMobileComponent;
  let fixture: ComponentFixture<CreateUserMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUserMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUserMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
