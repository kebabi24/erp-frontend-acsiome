import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStdItemComponent } from './edit-std-item.component';

describe('EditStdItemComponent', () => {
  let component: EditStdItemComponent;
  let fixture: ComponentFixture<EditStdItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditStdItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStdItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
