import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePopulationComponent } from './update-population.component';

describe('UpdatePopulationComponent', () => {
  let component: UpdatePopulationComponent;
  let fixture: ComponentFixture<UpdatePopulationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatePopulationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePopulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
