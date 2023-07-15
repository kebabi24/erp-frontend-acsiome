import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListVisitMobComponent } from './list-visit-mob.component';

describe('ListVisitMobComponent', () => {
  let component: ListVisitMobComponent;
  let fixture: ComponentFixture<ListVisitMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListVisitMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListVisitMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
