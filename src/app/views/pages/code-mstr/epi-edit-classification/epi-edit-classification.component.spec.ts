import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpiEditClassificationComponent } from './epi-edit-classification.component';

describe('EpiEditClassificationComponent', () => {
  let component: EpiEditClassificationComponent;
  let fixture: ComponentFixture<EpiEditClassificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpiEditClassificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpiEditClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
