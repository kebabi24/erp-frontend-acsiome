import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSoDetComponent } from './list-so-det.component';

describe('ListSoDetComponent', () => {
  let component: ListSoDetComponent;
  let fixture: ComponentFixture<ListSoDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSoDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSoDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
