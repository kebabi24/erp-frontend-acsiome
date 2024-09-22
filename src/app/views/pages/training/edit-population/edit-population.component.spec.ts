import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPopulationComponent } from './edit-population.component';

describe('EditPopulationComponent', () => {
  let component: EditPopulationComponent;
  let fixture: ComponentFixture<EditPopulationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPopulationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPopulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
