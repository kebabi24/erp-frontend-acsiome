import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesBoxComponent } from './sales-box.component';

describe('SalesBoxComponent', () => {
  let component: SalesBoxComponent;
  let fixture: ComponentFixture<SalesBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
