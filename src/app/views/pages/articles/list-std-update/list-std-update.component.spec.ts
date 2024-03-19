import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListStdUpdateComponent } from './list-std-update.component';

describe('ListStdUpdateComponent', () => {
  let component: ListStdUpdateComponent;
  let fixture: ComponentFixture<ListStdUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListStdUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListStdUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
