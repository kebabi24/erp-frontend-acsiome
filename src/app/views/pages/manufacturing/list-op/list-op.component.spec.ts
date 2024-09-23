import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOpComponent } from './list-op.component';

describe('ListOpComponent', () => {
  let component: ListOpComponent;
  let fixture: ComponentFixture<ListOpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
