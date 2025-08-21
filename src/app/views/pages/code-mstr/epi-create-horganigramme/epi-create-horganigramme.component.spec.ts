import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpiCreateHorganigrammeComponent } from './epi-create-horganigramme.component';

describe('EpiCreateHorganigrammeComponent', () => {
  let component: EpiCreateHorganigrammeComponent;
  let fixture: ComponentFixture<EpiCreateHorganigrammeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpiCreateHorganigrammeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpiCreateHorganigrammeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
