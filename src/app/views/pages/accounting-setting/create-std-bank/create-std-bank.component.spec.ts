import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStdBankComponent } from './create-std-bank.component';

describe('CreateStdBankComponent', () => {
  let component: CreateStdBankComponent;
  let fixture: ComponentFixture<CreateStdBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateStdBankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStdBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
