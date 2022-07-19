import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListItineraryComponent } from './list-itinerary.component';

describe('ListItineraryComponent', () => {
  let component: ListItineraryComponent;
  let fixture: ComponentFixture<ListItineraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListItineraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListItineraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
