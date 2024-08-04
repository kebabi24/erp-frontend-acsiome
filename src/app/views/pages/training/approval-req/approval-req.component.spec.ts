import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalReqComponent } from './approval-req.component';

describe('ApprovalReqComponent', () => {
  let component: ApprovalReqComponent;
  let fixture: ComponentFixture<ApprovalReqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalReqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
