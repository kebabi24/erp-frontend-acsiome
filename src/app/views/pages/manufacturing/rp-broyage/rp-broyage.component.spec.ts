import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RpBroyageComponent } from './rp-broyage.component';

describe('RpBroyageComponent', () => {
  let component: RpBroyageComponent;
  let fixture: ComponentFixture<RpBroyageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RpBroyageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RpBroyageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
