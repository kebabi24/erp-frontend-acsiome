import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserMobileComponent } from './edit-user-mobile.component';

describe('EditUserMobileComponent', () => {
  let component: EditUserMobileComponent;
  let fixture: ComponentFixture<EditUserMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditUserMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
