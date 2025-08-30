import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoUnreceipVendComponent } from './po-unreceip-vend.component';

describe('PoUnreceipVendComponent', () => {
  let component: PoUnreceipVendComponent;
  let fixture: ComponentFixture<PoUnreceipVendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoUnreceipVendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoUnreceipVendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
