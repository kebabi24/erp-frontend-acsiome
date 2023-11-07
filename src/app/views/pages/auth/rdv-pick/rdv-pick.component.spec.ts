import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RdvPickComponent } from './rdv-pick.component';

describe('RdvPickComponent', () => {
  let component: RdvPickComponent;
  let fixture: ComponentFixture<RdvPickComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RdvPickComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RdvPickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
