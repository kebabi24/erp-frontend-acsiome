import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpiByemployeListComponent } from './epi-byemploye-list.component';

describe('EpiByemployeListComponent', () => {
  let component: EpiByemployeListComponent;
  let fixture: ComponentFixture<EpiByemployeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpiByemployeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpiByemployeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
