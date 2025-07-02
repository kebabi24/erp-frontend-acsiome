import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListG50Component } from './list-g50.component';

describe('ListG50Component', () => {
  let component: ListG50Component;
  let fixture: ComponentFixture<ListG50Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListG50Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListG50Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
