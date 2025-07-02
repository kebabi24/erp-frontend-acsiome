import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpiNewemployeListComponent } from './epi-newemploye-list.component';

describe('EpiNewemployeListComponent', () => {
  let component: EpiNewemployeListComponent;
  let fixture: ComponentFixture<EpiNewemployeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpiNewemployeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpiNewemployeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
