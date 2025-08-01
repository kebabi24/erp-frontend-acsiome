import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAffectEquipementComponent } from './list-affect-equipement.component';

describe('ListAffectEquipementComponent', () => {
  let component: ListAffectEquipementComponent;
  let fixture: ComponentFixture<ListAffectEquipementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAffectEquipementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAffectEquipementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
