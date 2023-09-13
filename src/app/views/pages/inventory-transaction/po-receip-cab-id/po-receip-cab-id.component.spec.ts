import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoReceipCabIdComponent } from './po-receip-cab-id.component';

describe('PoReceipCabIdComponent', () => {
  let component: PoReceipCabIdComponent;
  let fixture: ComponentFixture<PoReceipCabIdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoReceipCabIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoReceipCabIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
