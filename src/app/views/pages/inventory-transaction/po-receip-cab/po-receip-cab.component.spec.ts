import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoReceipCabComponent } from './po-receip-cab.component';

describe('PoReceipCabComponent', () => {
  let component: PoReceipCabComponent;
  let fixture: ComponentFixture<PoReceipCabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoReceipCabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoReceipCabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
