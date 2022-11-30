import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerReclamationComponent } from './customer-reclamation.component';

describe('CustomerReclamationComponent', () => {
  let component: CustomerReclamationComponent;
  let fixture: ComponentFixture<CustomerReclamationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerReclamationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerReclamationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
