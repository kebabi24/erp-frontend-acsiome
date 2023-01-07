import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransListGrpComponent } from './trans-list-grp.component';

describe('TransListGrpComponent', () => {
  let component: TransListGrpComponent;
  let fixture: ComponentFixture<TransListGrpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransListGrpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransListGrpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
