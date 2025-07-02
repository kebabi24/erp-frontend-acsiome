import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionDeFormationComponent } from './gestion-de-formation.component';

describe('GestionDeFormationComponent', () => {
  let component: GestionDeFormationComponent;
  let fixture: ComponentFixture<GestionDeFormationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionDeFormationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionDeFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
