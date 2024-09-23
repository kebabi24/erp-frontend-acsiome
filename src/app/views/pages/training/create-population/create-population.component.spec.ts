import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePopulationComponent } from './create-population.component';

describe('CreatePopulationComponent', () => {
  let component: CreatePopulationComponent;
  let fixture: ComponentFixture<CreatePopulationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePopulationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePopulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
