import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitResultComponent } from './visit-result.component';

describe('CreateNewServiceComponent', () => {
  let component: VisitResultComponent;
  let fixture: ComponentFixture<VisitResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
