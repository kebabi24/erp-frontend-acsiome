import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSeqReqComponent } from './create-seq-req.component';

describe('CreateSeqReqComponent', () => {
  let component: CreateSeqReqComponent;
  let fixture: ComponentFixture<CreateSeqReqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSeqReqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSeqReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
