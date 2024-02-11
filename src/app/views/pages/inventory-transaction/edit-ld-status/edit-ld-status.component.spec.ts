import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLdStatusComponent } from './edit-ld-status.component';

describe('EditLdStatusComponent', () => {
  let component: EditLdStatusComponent;
  let fixture: ComponentFixture<EditLdStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLdStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLdStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
