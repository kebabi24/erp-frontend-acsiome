import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemodifyCabComponent } from './remodify-cab.component';

describe('RemodifyCabComponent', () => {
  let component: RemodifyCabComponent;
  let fixture: ComponentFixture<RemodifyCabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemodifyCabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemodifyCabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
