import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviAlimentationExtrusionComponent } from './suivi-alimentation-extrusion.component';

describe('SuiviAlimentationExtrusionComponent', () => {
  let component: SuiviAlimentationExtrusionComponent;
  let fixture: ComponentFixture<SuiviAlimentationExtrusionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuiviAlimentationExtrusionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuiviAlimentationExtrusionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
