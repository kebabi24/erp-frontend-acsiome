import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpiCreateHclassificationComponent } from './epi-create-hclassification.component';

describe('EpiCreateHclassificationComponent', () => {
  let component: EpiCreateHclassificationComponent;
  let fixture: ComponentFixture<EpiCreateHclassificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpiCreateHclassificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpiCreateHclassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
