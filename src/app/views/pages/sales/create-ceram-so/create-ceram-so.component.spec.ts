import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCeramSoComponent } from './create-ceram-so.component';

describe('CreateCeramSoComponent', () => {
  let component: CreateCeramSoComponent;
  let fixture: ComponentFixture<CreateCeramSoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCeramSoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCeramSoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
