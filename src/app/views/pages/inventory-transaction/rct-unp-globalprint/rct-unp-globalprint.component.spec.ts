import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RctUnpGlobalprintComponent } from './rct-unp-globalprint.component';

describe('RctUnpGlobalprintComponent', () => {
  let component: RctUnpGlobalprintComponent;
  let fixture: ComponentFixture<RctUnpGlobalprintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RctUnpGlobalprintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RctUnpGlobalprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
