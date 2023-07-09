import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadRequestListComponent } from './load-request-list.component';

describe('LoadRequestListComponent', () => {
  let component: LoadRequestListComponent;
  let fixture: ComponentFixture<LoadRequestListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadRequestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
