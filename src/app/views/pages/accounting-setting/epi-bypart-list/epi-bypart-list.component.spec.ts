import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpiBypartListComponent } from './epi-bypart-list.component';

describe('EpiBypartListComponent', () => {
  let component: EpiBypartListComponent;
  let fixture: ComponentFixture<EpiBypartListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpiBypartListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpiBypartListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
