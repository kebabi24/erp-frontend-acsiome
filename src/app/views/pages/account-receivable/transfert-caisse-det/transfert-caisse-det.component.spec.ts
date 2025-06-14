import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfertCaisseDetComponent } from './transfert-caisse-det.component';

describe('TransfertCaisseDetComponent', () => {
  let component: TransfertCaisseDetComponent;
  let fixture: ComponentFixture<TransfertCaisseDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransfertCaisseDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransfertCaisseDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
