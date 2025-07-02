import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControleActeComponent } from './controle-acte.component';

describe('ControleActeComponent', () => {
  let component: ControleActeComponent;
  let fixture: ComponentFixture<ControleActeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControleActeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControleActeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
