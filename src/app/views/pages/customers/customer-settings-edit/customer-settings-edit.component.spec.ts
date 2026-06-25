import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSettingsEditComponent } from './customer-settings-edit.component';

describe('CustomerSettingsEditComponent', () => {
  let component: CustomerSettingsEditComponent;
  let fixture: ComponentFixture<CustomerSettingsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerSettingsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSettingsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
