import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPosComponent } from './list-pos.component';

describe('ListPosComponent', () => {
  let component: ListPosComponent;
  let fixture: ComponentFixture<ListPosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
