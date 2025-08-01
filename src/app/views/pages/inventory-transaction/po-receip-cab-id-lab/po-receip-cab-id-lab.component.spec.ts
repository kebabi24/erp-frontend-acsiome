import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoReceipCabIdLabComponent } from './po-receip-cab-id-lab.component';

describe('PoReceipCabIdLabComponent', () => {
  let component: PoReceipCabIdLabComponent;
  let fixture: ComponentFixture<PoReceipCabIdLabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoReceipCabIdLabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoReceipCabIdLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
