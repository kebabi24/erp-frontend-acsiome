import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLocImmobilierComponent } from './create-loc-immobilier.component';

describe('CreateLocImmobilierComponent', () => {
  let component: CreateLocImmobilierComponent;
  let fixture: ComponentFixture<CreateLocImmobilierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLocImmobilierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLocImmobilierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
