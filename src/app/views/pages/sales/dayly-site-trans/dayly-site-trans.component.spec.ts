import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DaylySiteTransComponent } from './dayly-site-trans.component';

describe('DaylySiteTransComponent', () => {
  let component: DaylySiteTransComponent;
  let fixture: ComponentFixture<DaylySiteTransComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaylySiteTransComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaylySiteTransComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
