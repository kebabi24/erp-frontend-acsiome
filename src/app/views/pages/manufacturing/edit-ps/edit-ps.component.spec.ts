import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPsComponent } from './edit-ps.component';

describe('EditPsComponent', () => {
  let component: EditPsComponent;
  let fixture: ComponentFixture<EditPsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
