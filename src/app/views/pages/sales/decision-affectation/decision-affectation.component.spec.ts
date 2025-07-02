import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionAffectationComponent } from './decision-affectation.component';

describe('DecisionAffectationComponent', () => {
  let component: DecisionAffectationComponent;
  let fixture: ComponentFixture<DecisionAffectationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DecisionAffectationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionAffectationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
