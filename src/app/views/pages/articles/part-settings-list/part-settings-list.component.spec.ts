import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartSettingsListComponent } from './part-settings-list.component';

describe('PartSettingsListComponent', () => {
  let component: PartSettingsListComponent;
  let fixture: ComponentFixture<PartSettingsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartSettingsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartSettingsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
