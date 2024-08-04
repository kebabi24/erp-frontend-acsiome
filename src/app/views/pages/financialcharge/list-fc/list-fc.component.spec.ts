import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFcComponent } from './list-fc.component';

describe('ListFcComponent', () => {
  let component: ListFcComponent;
  let fixture: ComponentFixture<ListFcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListFcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
