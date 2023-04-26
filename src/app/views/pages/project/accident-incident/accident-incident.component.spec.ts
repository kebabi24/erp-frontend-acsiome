import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccidentIncidentComponent } from './accident-incident.component';

describe('AccidentIncidentComponent', () => {
  let component: AccidentIncidentComponent;
  let fixture: ComponentFixture<AccidentIncidentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccidentIncidentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccidentIncidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
