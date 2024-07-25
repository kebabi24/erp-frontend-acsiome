import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFcComponent } from './edit-fc.component';

describe('EditFcComponent', () => {
  let component: EditFcComponent;
  let fixture: ComponentFixture<EditFcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
