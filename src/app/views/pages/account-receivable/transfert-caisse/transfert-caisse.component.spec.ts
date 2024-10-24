import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfertCaisseComponent } from './transfert-caisse.component';

describe('TransfertCaisseComponent', () => {
  let component: TransfertCaisseComponent;
  let fixture: ComponentFixture<TransfertCaisseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransfertCaisseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransfertCaisseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
