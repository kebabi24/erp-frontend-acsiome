import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDiffLoadrequestComponent } from './list-diff-loadrequest.component';

describe('ListDiffLoadrequestComponent', () => {
  let component: ListDiffLoadrequestComponent;
  let fixture: ComponentFixture<ListDiffLoadrequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDiffLoadrequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDiffLoadrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
