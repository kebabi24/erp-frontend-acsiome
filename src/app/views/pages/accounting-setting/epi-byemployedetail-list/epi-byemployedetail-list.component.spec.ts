import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpiByemployedetailListComponent } from './epi-byemployedetail-list.component';

describe('EpiByemployedetailListComponent', () => {
  let component: EpiByemployedetailListComponent;
  let fixture: ComponentFixture<EpiByemployedetailListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpiByemployedetailListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpiByemployedetailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
