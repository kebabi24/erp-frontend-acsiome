import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusMouvementComponent } from './status-mouvement.component';

describe('StatusMouvementComponent', () => {
  let component: StatusMouvementComponent;
  let fixture: ComponentFixture<StatusMouvementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusMouvementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusMouvementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
