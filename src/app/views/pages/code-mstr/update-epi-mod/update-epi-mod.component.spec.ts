import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEpiModComponent } from './update-epi-mod.component';

describe('UpdateEpiModComponent', () => {
  let component: UpdateEpiModComponent;
  let fixture: ComponentFixture<UpdateEpiModComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateEpiModComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateEpiModComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
