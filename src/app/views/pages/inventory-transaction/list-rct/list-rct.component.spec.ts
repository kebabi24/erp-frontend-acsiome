import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRctComponent } from './list-rct.component';

describe('ListRctComponent', () => {
  let component: ListRctComponent;
  let fixture: ComponentFixture<ListRctComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListRctComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRctComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
