import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePfModComponent } from './create-pf-mod.component';

describe('CreatePfModComponent', () => {
  let component: CreatePfModComponent;
  let fixture: ComponentFixture<CreatePfModComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePfModComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePfModComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
