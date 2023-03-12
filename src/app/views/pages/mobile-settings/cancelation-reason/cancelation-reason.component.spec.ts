import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelationReasonComponent } from './cancelation-reason.component';

describe('CreateNewServiceComponent', () => {
  let component: CancelationReasonComponent;
  let fixture: ComponentFixture<CancelationReasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelationReasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelationReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
