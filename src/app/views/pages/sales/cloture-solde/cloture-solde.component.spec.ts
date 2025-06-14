import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClotureSoldeComponent } from './cloture-solde.component';

describe('ClotureSoldeComponent', () => {
  let component: ClotureSoldeComponent;
  let fixture: ComponentFixture<ClotureSoldeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClotureSoldeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClotureSoldeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
