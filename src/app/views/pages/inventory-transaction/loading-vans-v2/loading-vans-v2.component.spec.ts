import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingVansV2Component } from './loading-vans-v2.component';

describe('LoadingVansV2Component', () => {
  let component: LoadingVansV2Component;
  let fixture: ComponentFixture<LoadingVansV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingVansV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingVansV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
