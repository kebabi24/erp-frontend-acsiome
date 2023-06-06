import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRepComponent } from './list-rep.component';

describe('ListRepComponent', () => {
  let component: ListRepComponent;
  let fixture: ComponentFixture<ListRepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListRepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
