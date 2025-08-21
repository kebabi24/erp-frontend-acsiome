import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpiCreateOrganigrammeComponent } from './epi-create-organigramme.component';

describe('EpiCreateOrganigrammeComponent', () => {
  let component: EpiCreateOrganigrammeComponent;
  let fixture: ComponentFixture<EpiCreateOrganigrammeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpiCreateOrganigrammeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpiCreateOrganigrammeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
