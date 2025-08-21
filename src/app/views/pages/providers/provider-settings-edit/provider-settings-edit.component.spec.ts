import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderSettingsEditComponent } from './provider-settings-edit.component';

describe('ProviderSettingsEditComponent', () => {
  let component: ProviderSettingsEditComponent;
  let fixture: ComponentFixture<ProviderSettingsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderSettingsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderSettingsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
