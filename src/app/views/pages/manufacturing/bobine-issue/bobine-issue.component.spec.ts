import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BobineIssueComponent } from './bobine-issue.component';

describe('BobineIssueComponent', () => {
  let component: BobineIssueComponent;
  let fixture: ComponentFixture<BobineIssueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BobineIssueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BobineIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
