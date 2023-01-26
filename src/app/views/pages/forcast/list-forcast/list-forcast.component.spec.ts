import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListForcastComponent } from './list-forcast.component';

describe('ListForcastComponent', () => {
  let component: ListForcastComponent;
  let fixture: ComponentFixture<ListForcastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListForcastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListForcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
