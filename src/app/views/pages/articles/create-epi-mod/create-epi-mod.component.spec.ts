import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEpiModComponent } from './create-epi-mod.component';

describe('CreateEpiModComponent', () => {
  let component: CreateEpiModComponent;
  let fixture: ComponentFixture<CreateEpiModComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEpiModComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEpiModComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
