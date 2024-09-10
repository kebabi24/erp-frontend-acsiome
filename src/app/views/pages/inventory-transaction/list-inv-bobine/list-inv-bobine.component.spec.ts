import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInvBobineComponent } from './list-inv-bobine.component';

describe('ListInvBobineComponent', () => {
  let component: ListInvBobineComponent;
  let fixture: ComponentFixture<ListInvBobineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListInvBobineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInvBobineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
