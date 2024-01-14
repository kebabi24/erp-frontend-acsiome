import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfertArComponent } from './transfert-ar.component';

describe('TransfertArComponent', () => {
  let component: TransfertArComponent;
  let fixture: ComponentFixture<TransfertArComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransfertArComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransfertArComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
