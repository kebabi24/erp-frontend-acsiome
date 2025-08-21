import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderSettingsListComponent } from './provider-settings-list.component';

describe('ProviderSettingsListComponent', () => {
  let component: ProviderSettingsListComponent;
  let fixture: ComponentFixture<ProviderSettingsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderSettingsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderSettingsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
