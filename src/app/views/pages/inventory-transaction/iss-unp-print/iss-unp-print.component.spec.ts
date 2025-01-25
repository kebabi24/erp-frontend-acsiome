import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssUnpPrintComponent } from './iss-unp-print.component';

describe('IssUnpPrintComponent', () => {
  let component: IssUnpPrintComponent;
  let fixture: ComponentFixture<IssUnpPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssUnpPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssUnpPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
