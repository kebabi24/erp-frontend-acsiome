import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewItineraryComponent } from './create-new-itinerary.component';

describe('CreateNewItineraryComponent', () => {
  let component: CreateNewItineraryComponent;
  let fixture: ComponentFixture<CreateNewItineraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewItineraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewItineraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
