import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpiCreateClassificationComponent } from './epi-create-classification.component';

describe('EpiCreateClassificationComponent', () => {
  let component: EpiCreateClassificationComponent;
  let fixture: ComponentFixture<EpiCreateClassificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpiCreateClassificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpiCreateClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
