import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopulationAddComponent } from './population-add.component';

describe('CreateCustomerMobileComponent', () => {
  let component: PopulationAddComponent;
  let fixture: ComponentFixture<PopulationAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopulationAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopulationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
