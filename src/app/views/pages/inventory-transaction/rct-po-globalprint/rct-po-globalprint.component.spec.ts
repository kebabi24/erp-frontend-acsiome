import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RctPoGlobalprintComponent } from './rct-po-globalprint.component';

describe('RctPoGlobalprintComponent', () => {
  let component: RctPoGlobalprintComponent;
  let fixture: ComponentFixture<RctPoGlobalprintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RctPoGlobalprintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RctPoGlobalprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
