import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUserMobileComponent } from './list-user-mobile.component';

describe('ListUserMobileComponent', () => {
  let component: ListUserMobileComponent;
  let fixture: ComponentFixture<ListUserMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListUserMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListUserMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
