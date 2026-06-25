import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSoImmobilierComponent } from './edit-so-immobilier.component';

describe('EditSoImmobilierComponent', () => {
  let component: EditSoImmobilierComponent;
  let fixture: ComponentFixture<EditSoImmobilierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSoImmobilierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSoImmobilierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
