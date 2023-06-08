import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStatusRefComponent } from './edit-status-ref.component';

describe('EditStatusRefComponent', () => {
  let component: EditStatusRefComponent;
  let fixture: ComponentFixture<EditStatusRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditStatusRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStatusRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
