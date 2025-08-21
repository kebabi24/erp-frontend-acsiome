import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpiListOrganigrammeComponent } from './epi-list-organigramme.component';

describe('EpiListOrganigrammeComponent', () => {
  let component: EpiListOrganigrammeComponent;
  let fixture: ComponentFixture<EpiListOrganigrammeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpiListOrganigrammeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpiListOrganigrammeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
