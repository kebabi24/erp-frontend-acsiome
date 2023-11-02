import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlResultsEntryComponent } from './control-results-entry.component';

describe('ControlResultsEntryComponent', () => {
  let component: ControlResultsEntryComponent;
  let fixture: ComponentFixture<ControlResultsEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlResultsEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlResultsEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
