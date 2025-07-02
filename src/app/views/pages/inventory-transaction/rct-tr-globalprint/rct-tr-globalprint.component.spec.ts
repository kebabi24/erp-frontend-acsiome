import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RctTrGlobalprintComponent } from './rct-tr-globalprint.component';

describe('RctTrGlobalprintComponent', () => {
  let component: RctTrGlobalprintComponent;
  let fixture: ComponentFixture<RctTrGlobalprintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RctTrGlobalprintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RctTrGlobalprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
