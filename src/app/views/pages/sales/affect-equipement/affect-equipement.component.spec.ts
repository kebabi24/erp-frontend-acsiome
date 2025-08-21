import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectEquipementComponent } from './affect-equipement.component';

describe('AffectEquipementComponent', () => {
  let component: AffectEquipementComponent;
  let fixture: ComponentFixture<AffectEquipementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffectEquipementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AffectEquipementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
