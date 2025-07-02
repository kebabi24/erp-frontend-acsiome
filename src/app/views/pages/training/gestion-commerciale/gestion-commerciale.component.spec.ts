import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCommercialeComponent } from './gestion-commerciale.component';

describe('GestionCommercialeComponent', () => {
  let component: GestionCommercialeComponent;
  let fixture: ComponentFixture<GestionCommercialeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionCommercialeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionCommercialeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
