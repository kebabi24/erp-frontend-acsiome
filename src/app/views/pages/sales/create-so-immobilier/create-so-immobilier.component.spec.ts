import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSoImmobilierComponent } from './create-so-immobilier.component';

describe('CreateSoImmobilierComponent', () => {
  let component: CreateSoImmobilierComponent;
  let fixture: ComponentFixture<CreateSoImmobilierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSoImmobilierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSoImmobilierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
