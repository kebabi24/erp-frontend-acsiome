import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTransactionListComponent } from './edit-transaction-list.component';

describe('EditTransactionListComponent', () => {
  let component: EditTransactionListComponent;
  let fixture: ComponentFixture<EditTransactionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTransactionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTransactionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
