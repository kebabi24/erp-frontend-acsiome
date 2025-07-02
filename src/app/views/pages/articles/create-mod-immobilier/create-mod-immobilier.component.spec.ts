import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateModImmobilierComponent } from './create-mod-immobilier.component';

describe('CreateModImmobilierComponent', () => {
  let component: CreateModImmobilierComponent;
  let fixture: ComponentFixture<CreateModImmobilierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateModImmobilierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateModImmobilierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
