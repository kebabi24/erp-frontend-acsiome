import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartSettingsEditComponent } from './part-settings-edit.component';

describe('PartSettingsEditComponent', () => {
  let component: PartSettingsEditComponent;
  let fixture: ComponentFixture<PartSettingsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartSettingsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartSettingsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
