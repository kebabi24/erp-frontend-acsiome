import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankJournalComponent } from './bank-journal.component';

describe('BankJournalComponent', () => {
  let component: BankJournalComponent;
  let fixture: ComponentFixture<BankJournalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankJournalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
