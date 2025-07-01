import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpiListClassificationComponent } from './epi-list-classification.component';

describe('EpiListClassificationComponent', () => {
  let component: EpiListClassificationComponent;
  let fixture: ComponentFixture<EpiListClassificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpiListClassificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpiListClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
