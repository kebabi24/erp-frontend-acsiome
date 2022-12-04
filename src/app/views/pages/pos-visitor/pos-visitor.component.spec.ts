import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosVisitorComponent } from './pos-visitor.component';

describe('PosVisitorComponent', () => {
  let component: PosVisitorComponent;
  let fixture: ComponentFixture<PosVisitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosVisitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
