import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqApprovalComponent } from './req-approval.component';

describe('ReqApprovalComponent', () => {
  let component: ReqApprovalComponent;
  let fixture: ComponentFixture<ReqApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReqApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReqApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
