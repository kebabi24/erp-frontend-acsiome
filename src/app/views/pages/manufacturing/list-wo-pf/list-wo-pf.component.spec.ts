import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWoPfComponent } from './list-wo-pf.component';

describe('ListWoPfComponent', () => {
  let component: ListWoPfComponent;
  let fixture: ComponentFixture<ListWoPfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListWoPfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListWoPfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
