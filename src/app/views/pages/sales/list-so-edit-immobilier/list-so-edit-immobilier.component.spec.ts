import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSoEditImmobilierComponent } from './list-so-edit-immobilier.component';

describe('ListSoEditImmobilierComponent', () => {
  let component: ListSoEditImmobilierComponent;
  let fixture: ComponentFixture<ListSoEditImmobilierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSoEditImmobilierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSoEditImmobilierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
