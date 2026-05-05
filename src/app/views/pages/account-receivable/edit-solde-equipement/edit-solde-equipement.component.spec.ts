import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSoldeEquipementComponent } from './edit-solde-equipement.component';

describe('EditSoldeEquipementComponent', () => {
  let component: EditSoldeEquipementComponent;
  let fixture: ComponentFixture<EditSoldeEquipementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSoldeEquipementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSoldeEquipementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
