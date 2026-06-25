import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartSettingsComponent } from './part-settings.component';

describe('PartSettingsComponent', () => {
  let component: PartSettingsComponent;
  let fixture: ComponentFixture<PartSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
