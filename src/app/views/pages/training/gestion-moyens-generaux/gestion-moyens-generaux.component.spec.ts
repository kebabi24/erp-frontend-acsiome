import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionMoyensGenerauxComponent } from './gestion-moyens-generaux.component';

describe('GestionMoyensGenerauxComponent', () => {
  let component: GestionMoyensGenerauxComponent;
  let fixture: ComponentFixture<GestionMoyensGenerauxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionMoyensGenerauxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionMoyensGenerauxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
