import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPopulationComponent } from './list-population.component';

describe('ListPopulationComponent', () => {
  let component: ListPopulationComponent;
  let fixture: ComponentFixture<ListPopulationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPopulationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPopulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
