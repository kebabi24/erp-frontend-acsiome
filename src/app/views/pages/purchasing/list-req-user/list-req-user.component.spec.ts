import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListReqUserComponent } from './list-req-user.component';

describe('ListReqUserComponent', () => {
  let component: ListReqUserComponent;
  let fixture: ComponentFixture<ListReqUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListReqUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListReqUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
