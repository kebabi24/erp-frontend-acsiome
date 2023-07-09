import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPaiementMobComponent } from './list-paiement-mob.component';

describe('ListPaiementMobComponent', () => {
  let component: ListPaiementMobComponent;
  let fixture: ComponentFixture<ListPaiementMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPaiementMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPaiementMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
