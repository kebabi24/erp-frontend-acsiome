import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccountingInvComponent } from './create-accounting-inv.component';

describe('CreateAccountingInvComponent', () => {
  let component: CreateAccountingInvComponent;
  let fixture: ComponentFixture<CreateAccountingInvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAccountingInvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAccountingInvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
