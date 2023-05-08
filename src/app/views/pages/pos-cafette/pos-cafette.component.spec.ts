import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosCafetteComponent } from './pos-cafette.component';

describe('PosCafetteComponent', () => {
  let component: PosCafetteComponent;
  let fixture: ComponentFixture<PosCafetteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosCafetteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosCafetteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
