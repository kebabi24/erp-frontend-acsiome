import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSeqReqComponent } from './edit-seq-req.component';

describe('EditSeqReqComponent', () => {
  let component: EditSeqReqComponent;
  let fixture: ComponentFixture<EditSeqReqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSeqReqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSeqReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
