import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectEquipGrosComponent } from './affect-equip-gros.component';

describe('AffectEquipGrosComponent', () => {
  let component: AffectEquipGrosComponent;
  let fixture: ComponentFixture<AffectEquipGrosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffectEquipGrosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AffectEquipGrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
