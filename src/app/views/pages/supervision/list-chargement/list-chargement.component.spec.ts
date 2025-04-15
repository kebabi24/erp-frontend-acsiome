import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListChargementComponent } from './list-chargement.component';

describe('ListChargementComponent', () => {
  let component: ListChargementComponent;
  let fixture: ComponentFixture<ListChargementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListChargementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListChargementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
