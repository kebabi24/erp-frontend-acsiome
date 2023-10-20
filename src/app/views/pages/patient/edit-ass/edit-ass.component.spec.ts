import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAssComponent } from './edit-ass.component';

describe('EditAssComponent', () => {
  let component: EditAssComponent;
  let fixture: ComponentFixture<EditAssComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAssComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
