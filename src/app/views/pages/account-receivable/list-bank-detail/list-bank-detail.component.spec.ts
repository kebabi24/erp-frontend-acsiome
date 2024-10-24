import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBankDetailComponent } from './list-bank-detail.component';

describe('ListBankDetailComponent', () => {
  let component: ListBankDetailComponent;
  let fixture: ComponentFixture<ListBankDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBankDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBankDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
