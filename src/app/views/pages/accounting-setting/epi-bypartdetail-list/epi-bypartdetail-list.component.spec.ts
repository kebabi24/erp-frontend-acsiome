import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpiBypartdetailListComponent } from './epi-bypartdetail-list.component';

describe('EpiBypartdetailListComponent', () => {
  let component: EpiBypartdetailListComponent;
  let fixture: ComponentFixture<EpiBypartdetailListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpiBypartdetailListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpiBypartdetailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
