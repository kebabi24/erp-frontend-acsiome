import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAssComponent } from './list-ass.component';

describe('ListAssComponent', () => {
  let component: ListAssComponent;
  let fixture: ComponentFixture<ListAssComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAssComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
