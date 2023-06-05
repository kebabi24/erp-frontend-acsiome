import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSoEditComponent } from './list-so-edit.component';

describe('ListSoEditComponent', () => {
  let component: ListSoEditComponent;
  let fixture: ComponentFixture<ListSoEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSoEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
