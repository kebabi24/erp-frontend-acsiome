import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSettingsListComponent } from './customer-settings-list.component';

describe('CustomerSettingsListComponent', () => {
  let component: CustomerSettingsListComponent;
  let fixture: ComponentFixture<CustomerSettingsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerSettingsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSettingsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
