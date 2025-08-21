import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSeqReqComponent } from './list-seq-req.component';

describe('ListSeqReqComponent', () => {
  let component: ListSeqReqComponent;
  let fixture: ComponentFixture<ListSeqReqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSeqReqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSeqReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
