import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImputProjectInvoiceComponent } from './imput-project-invoice.component';

describe('ImputProjectInvoiceComponent', () => {
  let component: ImputProjectInvoiceComponent;
  let fixture: ComponentFixture<ImputProjectInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImputProjectInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImputProjectInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
