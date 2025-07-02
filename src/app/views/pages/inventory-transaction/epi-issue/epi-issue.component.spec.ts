import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpiIssueComponent } from './epi-issue.component';

describe('EpiIssueComponent', () => {
  let component: EpiIssueComponent;
  let fixture: ComponentFixture<EpiIssueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpiIssueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpiIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
