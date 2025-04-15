import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTaxpayementSettingsComponent } from './create-taxpayement-settings.component';

describe('CreateTaxpayementSettingsComponent', () => {
  let component: CreateTaxpayementSettingsComponent;
  let fixture: ComponentFixture<CreateTaxpayementSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTaxpayementSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTaxpayementSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
