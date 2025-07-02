import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPtbComponent } from './list-ptb.component';

describe('ListPtbComponent', () => {
  let component: ListPtbComponent;
  let fixture: ComponentFixture<ListPtbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPtbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPtbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
